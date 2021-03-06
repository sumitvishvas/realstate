const express = require("express");

const { User, validateUser } = require("../models/user");
const { ClientLead } = require("../models/clientData");
const spaceReplacer = require("../util/usefulFunctions");
const router = express.Router();
const jwt =require('jsonwebtoken');
const url = require('url');
const nodemailer = require('nodemailer');
var uniqid = require("uniqid");
const bcrypt=require("bcrypt");
const trimRequest = require("trim-request"); 
const fs =require("fs");
const sequelize = require('sequelize');
const { FlatOrHouse, validateFltasOrHouse,PlotOrLand, validatePlotsOrLand,Project,Companies,Locality,validateLocality } = require("../models/adminModels");
const{unLinkFiles1}=require('../util/fileUnlink');
const multer = require("multer");
const sharp = require("sharp");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const logger = require("../util/logger");

router.get("/realAdmin", (req, res) => {
  res.redirect("/admin/dashboard");
});

router.get("/dashboard", (req, res) => {
  res.render("admin/index");
});

router.get("/login", async(req, res) => {
  let msg = req.flash("notify");
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }
  if(req.session.email){
    var result=await User.findOne({where:{_id:req.session._id}});
    res.render("admin/user-profile",{result,message:req.flash('message'),msg_alert:req.flash('msg_alert')});
 }else{
          //  req.flash("msg","Please Login");

  
  res.render("admin/sign-in", {msg:msg});
 }
  
});

router.post("/login",async(req,res)=>{
  // res.send(req.body);
  const email=req.body.email;
  const user = await User.findOne({ where: {email} });
  if (user){
    var check =await bcrypt.compare(req.body.password,user.password);
        if(check){
      req.flash("msg_alert"," alert alert-success");
      req.flash("message","Login Succesfully");
        console.log('LOGIN Successfully');

      sess =req.session;
      sess._id=user._id;
      sess.name=user.fullname;
      sess.email=user.email;
      res.redirect('/admin/login');
    }else{
      req.flash("message","Invalaid password");

            res.redirect('/admin/login');
    }

  }

})
router.get('/forget-password',(req,res)=>{
  let msg="";
  let alert_class="";
  if(msg=req.flash('msg') , alert_class=req.flash('alert_class')){
    
  }
  res.render('admin/forget-password',{msg,alert_class});
 
})
router.post('/forget-password',async(req,res)=>{
  
  const Email=req.body.email;
  // console.log(email);
  // const sess=req.session;
   req.session.email=Email;
   console.log("email"+Email);

  //  if(Email=="Enter Email" || Email=="Email address:"){
  //    res.send('0')
  //  }else{
    
  //  }
   res.send('1');
 
  
})

router.get('/reset-password/:_id/:token',async(req,res,next)=>{
  
const {_id,token}=req.params;
  const user = await User.findOne({ where: {_id} });
  if(user){
    const secret=process.env.JWT_SECRET+user.password;
    try {
      const payload=jwt.verify(token,secret);
      // console.log(payload);
      req.flash('msg','Please Passward reset.');
      res.render('admin/password-reset',{email:user.email,_id,msg:req.flash('msg')});
    } catch (error) {
      console.log(error.message);
      req.flash('alert_class','alert alert-danger');
      if(error.message=="jwt expired"){
        req.flash('msg','Link are  Expired !');
      }
      if(error.message=="invalid signature"){
        req.flash('msg','Link will be already used !');
      }
      
      res.redirect('../../forget-password');
      
    }

  }

  // console.log(user);
  
 
})

router.post('/reset-password/:_id/:token',async(req,res,next)=>{
  
  const {_id,token}=req.params;
  const {password}=req.body;
  console.log(password);
  
  var salt =bcrypt.genSaltSync(10);
  const hash =bcrypt.hashSync(password,salt);
    const user = await User.findOne({ where: {_id} });

    if(user){
      
      const secret=process.env.JWT_SECRET+user.password;
      try {
        const payload=jwt.verify(token,secret);
        console.log(payload);
        User.update({password:hash}, { where: {_id}, });
        req.flash('msg','Password updated.');
         res.redirect('../../login');
        
        // res.render('admin/password-reset',{msg:req.flash('message')});
      } catch (error) {
        console.log(error.message);
        res.send(error.message)
        
      }
    }
  
    
  
    console.log(user);
    
   
  })

router.post('/forgetPassword-linkSend',async(req,res)=>{
  
  console.log('EMAIL'+req.body.email);
  const email=req.body.email;
  const user = await User.findOne({ where: {email} });

  const secret=process.env.JWT_SECRET+user.password;
  const payload={
    email:user.email,
    id:user._id
  }
const token =jwt.sign(payload,secret,{expiresIn:'10m'});
const link =`http://localhost:3000/admin/reset-password/${user._id}/${token}`;
console.log(link);
  var transporter = nodemailer.createTransport({
      
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'sumitvishvasphp@gmail.com',
      pass: 'chooja@333'
    }
  });
  let msg=`<h3>Welcome <i>${user.fullname}</i>iyour password link below</h3><br/>Reset link is <a href="${link}">Click Here</a><br/>`
  var mailOptions = {
    from: 'sumitvishvasphp@gmail.com',
    to: email,
    subject: 'Paassword  Reset',
    html:msg
    
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      // winston.error(error);
       console.log("err",error);
    } else {
       succ= {"message":"Thank you for contacting Us ???????? we will get back to you soon!", "status":"success"}
      // winston.info('Email sent: ' + info.response)
      req.flash("msg", 'Password Reset link send your mail. This expire 10 min.');
      
     
      return res.redirect('login');
    
    }
  });

 
})

router.post('/forgetPasswordEmailValidatior',async(req,res)=>{
  const email=req.body.email;
  const user = await User.findOne({ where: {email} });

  if(user){
    res.send('true');
  }else{
    res.send('false');
  }
  
})

router.get('/logout',(req,res)=>{
  req.session.destroy((error)=>{
    if(error){
        console.log(error);
    }
   
    res.redirect('/admin/login');

})

})

router.get("/registerUser", (req, res) => {
  res.render("admin/createUser");
});

router.post("/registerUser", async (req, res) => {
  let flag = validateUser(req.body);
  console.log(flag);
  
  if (flag !== "1") {
    return res.redirect("/admin/registerUser");
  }

  const user = await User.findOne({ where: { email: req.body.email } });
  if (user !== null) {
    console.log("in f");
    return res.redirect("/admin/registerUser");
  }
  var salt =bcrypt.genSaltSync(10);
  const hash =bcrypt.hashSync(req.body.password,salt);
  req.body.fullname = req.body.fname + " " + req.body.lname;

   await User.create({
    email: req.body.email,
    fullname: req.body.fullname,
    password: hash,
    createdBy: "Raj",
  })
    .then((result) => {
      
     return res.redirect("/admin/login");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/createFlate",async (req, res) => {
  const loc=await Locality.findAll();
  const proj=await Project.findAll({
    attributes: [
      "_id",
      "projectName"
     ]
  });
  res.render("admin/createFlate",{data:loc,proj:proj});
});

router.get("/createPlot_Land",async (req, res) => {
  const loc=await Locality.findAll();
  const proj=await Project.findAll({
    attributes: [
      "_id",
      "projectName"
     ]
  });
  res.render("admin/createPlot_Land",{data:loc,proj:proj});
});

const uploads = upload.fields([{ name: "gallery", maxCount: 6 }]);
router.post("/createFlat", uploads, trimRequest.all, async (req, res) => {
  try {
    let galleryImage = {
      banner: {},
      gallery: [],
    };
    let soci = spaceReplacer(req.body.societyName);
    let local = spaceReplacer(req.body.locality);
    let type =req.body.propType === "Apartment" ? "flat-Apartment" : req.body.propType;
    let uuid = uniqid.time();
    let url = `${req.body.bedrooms}bhk-${type}-for-sale-in-${local}-lucknow-built-up-area-${req.body.BuiltUpArea}-square-feet-${uuid}`;
    
    url = url.toLowerCase();
    let pd= req.body.propDetails.trim();
    if(pd == ""){
      pd= req.body.BuiltUpArea+' Square feet Area '+req.body.propType+' for sale in '+req.body.locality+', Lucknow.  This '+req.body.propType+' is available at a price of Rs '+req.body.expectedPrice+'. The average price per sqft is Rs '+Math.round(req.body.expectedPrice/req.body.BuiltUpArea)+'. The name of the project is Arsha Madhav Greens Plots. '
      
    }
    let src = uniqid() + "-" + req.files["gallery"][0].originalname;
    await sharp(req.files["gallery"][0].buffer)
      .resize({ width: 640, height: 360 })
      .toFile("./public/assets/uploads/" + src)
      .then()
      .catch((err) => {
        logger.error(err);
      });
    galleryImage.banner["src"] = src;
    let tinySrc = "";
    let bigSrc = "";
    req.files["gallery"].forEach((item) => {
      tinySrc = uniqid() + "-" + item.originalname;
      sharp(item.buffer)
        .resize({ width: 400, height: 265 })
        .toFile("./public/assets/uploads/" + tinySrc)
        .then()
        .catch((err) => {
          logger.error(err);
        });
      bigSrc = uniqid() + "-" + item.originalname;
      sharp(item.buffer)
        .resize({ width: 950, height: 630 })
        .toFile("./public/assets/uploads/" + bigSrc)
        .then()
        .catch((err) => {
          logger.error(err);
        });

      galleryImage.gallery.push({
        smImg: tinySrc,
        bgImg: bigSrc,
      });
    });
    let galleryImageStr = JSON.stringify(galleryImage);
    // console.log(`tinySrc=${req.body.societyName}`);

    // have to created by  owned by and order by
    FlatOrHouse.create({
      url: url,
      socityName: req.body.societyName,
      locality: req.body.locality,
      flatOrHouseNum: req.body.flatOrHouseNum,
      propType: req.body.propType,
      totalFloor: req.body.totalFloor,
      bedrooms: req.body.bedrooms,
      balconies: req.body.balconies,
      bathrooms: req.body.bathrooms,
      BuiltUpArea: req.body.BuiltUpArea,
      otherRooms: req.body.otherRooms,
      furnishing: req.body.furnishing,
      ameneties: req.body.ameneties,
      expectedPrice: req.body.expectedPrice,
      priceNegotiable: req.body.priceNegotiable,
      propDetails: pd,
      gallery: galleryImageStr,
      videoLink: req.body.videoLink,
      uuid: uuid,
      projectId:req.body.projId,
      createdBy:"1"
    }).then(res.send("new property added."));
  } catch (err) {
    console.log("error from /createflat" + err);
    res.send("something went wrong");
  }
});

router.post("/createPlot_Land", uploads, trimRequest.all, async (req, res) => {
  try {
    let galleryImage = {
      banner: {},
      gallery: [],
    };
    let propd=req.body.propDetails.trim();
    if(propd ==""){
      propd=req.body.TotalArea+' Square feet  '+req.body.propType+' plot for sale in '+req.body.locality+', Lucknow.  This '+req.body.propType+' is available at a price of Rs '+req.body.TotalPrice+'. The plot price in sqft is Rs '+Math.round(req.body.TotalPrice/req.body.TotalArea)+'. The name of the project is '+req.body.projectName+' Plots.'
    }
    let soci = spaceReplacer(req.body.societyName);
    let local = spaceReplacer(req.body.locality);
    let type = req.body.propType === "Commercial" ? "Residential" : req.body.propType;
    let uuid = uniqid.time();
    let url = `${req.body.TotalArea}-square-feet-${type}-Plots-for-sale-in-${local}-lucknow-offered-price-${req.body.TotalPrice}-rs-${uuid}`;
    url = url.toLowerCase();
    let src = uniqid() + "-" + req.files["gallery"][0].originalname;
    await sharp(req.files["gallery"][0].buffer)
      .resize({ width: 640, height: 360 })
      .toFile("./public/assets/uploads/" + src);
    galleryImage.banner["src"] = src;
    let tinySrc = "";
    let bigSrc = "";
    req.files["gallery"].forEach((item) => {
      tinySrc = uniqid() + "-" + item.originalname;
      sharp(item.buffer)
        .resize({ width: 400, height: 265 })
        .toFile("./public/assets/uploads/" + tinySrc)
        .then()
        .catch((err) => {
          console.log(err);
        });
      bigSrc = uniqid() + "-" + item.originalname;
      sharp(item.buffer)
        .resize({ width: 950, height: 630 })
        .toFile("./public/assets/uploads/" + bigSrc)
        .then()
        .catch((err) => {
          console.log(err);
        });

      galleryImage.gallery.push({
        smImg: tinySrc,
        bgImg: bigSrc,
      });
    });
    let galleryImageStr = JSON.stringify(galleryImage);
    // console.log(`tinySrc=${req.body.societyName}`);

    // have to created by  owned by and order by
    console.log(req.body);
    PlotOrLand.create({
      url: url,
      socityName: req.body.societyName,
      locality: req.body.locality,
      plotOrLandNum: req.body.plotOrLandNum,
      propType: req.body.propType,

      TotalArea: req.body.TotalArea,

      TotalPrice: req.body.TotalPrice,
      priceNegotiable: req.body.priceNegotiable,
      propDetails: propd,
      gallery: galleryImageStr,
      videoLink: req.body.videoLink,
      uuid: uuid,
      projectId:req.body.projId,
      createdBy:"1"
    }).then(res.send("New Plot added."));
  } catch (err) {
    logger.error("error from /createflat" + err);
    res.send("something went wrong");
  }
});

router.get("/getflatsorhousedata", async (req, res) => {
  const flatOrHouses = await FlatOrHouse.findAll({
    attributes: [
      "_id",
      "uuid",
      "propType",
      "socityName",
      "locality",
      "bedrooms",
      "BuiltUpArea",
      "expectedPrice",
      "url",
    ],
  });
  if (flatOrHouses === null) {
    console.log("Not found!");
  } else {
    console.log("All users:", JSON.stringify(flatOrHouses, null, 2));
    res.render("admin/getFlatsOrHouseTable", {
      data: flatOrHouses,
      tableName: "FlatOrHouse",
    });
    // Its primary key is 123
  }
  // console.log(users.every(user => user instanceof User)); // true
});
router.get("/getplotsorlanddata", async (req, res) => {
  res.render("admin/getPlotsOrLandTable", { tableName: "PlotOrLand" });
});

router.post("/plotLandData", async (req, res) => {
  //     console.log(req.body);

  // console.log(req.body.search.value);
  var tableName = req.body.tableName;

  // Coming from databale itself. Limit is the visible number of data
  var limit = parseInt(req.body.length);
  var start = parseInt(req.body.start);
  var order = req.body.order;
  var search = req.body.search;
  var search = search.value;

  // console.log(order);

  var col = "";
  var dir = "";
  var o = "";

  if (Array.isArray(order) && order.length) {
    order.forEach((o) => {
      col = o["column"];
      dir = o["dir"];
    });
  }
  if (dir !== "asc" && dir !== "desc") {
    dir = "desc";
  }

  // console.log(`${dir}`);

  var columns = {
    0: "_id",
    1: "_id",
    2: "propType",
    3: "socityName",
    4: "locality",

    5: "TotalArea",
    6: "TotalPrice",
    7: "url",
  };
  console.log(columns[0]);

  if (columns[col]) {
    order = columns[col];
  } else {
    order = null;
  }

  // console.log(order);

  if (search !== "") {
    // console.log(search);
    var plotOrLand = await PlotOrLand.findAll({
      where: {
        [sequelize.Op.or]: {
          _id: { [sequelize.Op.like]: "%" + search + "%" },
          propType: { [sequelize.Op.like]: "%" + search + "%" },
          socityName: { [sequelize.Op.like]: "%" + search + "%" },
          locality: { [sequelize.Op.like]: "%" + search + "%" },
          TotalArea: { [sequelize.Op.like]: "%" + search + "%" },
          TotalPrice: { [sequelize.Op.like]: "%" + search + "%" },
        },
      },
      order: [[order, dir]],
      offset: start,
      limit: limit,
    });
  } else {
    var plotOrLand = await PlotOrLand.findAll({
      attributes: [
        "_id",
        "uuid",
        "propType",
        "socityName",
        "locality",

        "TotalArea",
        "TotalPrice",
        "url",
      ],
      order: [[order, dir]],
      offset: start,
      limit: limit,
    });
  }

  var TotalData = await PlotOrLand.findAll({
    attributes: ["_id", [sequelize.fn("count", sequelize.col("_id")), "count"]],
    // group : ['plotOrLand._id'],
    raw: true,
    order: sequelize.literal("count DESC"),
  });
  var TotalRows = TotalData[0].count;
  console.log(`TotalDATA -> ${TotalRows}`);
  // console.log(count[0].count);
  var Data = [];
  plotOrLand.forEach((data, index) => {
    // console.log(data.locality+"  "+(index+1));
    var id = data._id;
    var uuid = data.uuid;
    var propType = data.propType;
    var socityName = data.socityName;
    var locality = data.locality;
    var TotalPrice = data.TotalPrice;
    var TotalArea = data.TotalArea;
    var url = data.url;

    var nestedData = {
      "#": index + 1,
      id: id,
      propType: propType,
      socityName: socityName,
      locality: locality,
      TotalPrice: TotalPrice,
      TotalArea: TotalArea,
      view: `<td><a href="" target="_blank"> <i class="fa fa-external-link" aria-hidden="true"></i></a></td>`,
      edit: `<td><button class="btn-success btn " onclick="editTour()" >Edit</button></td>`,
      delete: `<td><button class="btn btn-danger" onclick="deleteProperty('${id}','${tableName}')">Delete</button></td>`,
    };

    Data.push(nestedData);

    // Data =nestedData;
    // console.log(Data);
  });
  //   console.log(`DATA`);
  // console.log(Data);

  var table_data = JSON.stringify({
    draw: req.body.draw,
    recordsFiltered: parseInt(TotalRows),
    recordsTotal: parseInt(TotalRows),
    data: Data,
  });
  res.send(table_data);
  // console.log(table_data);
});

router.delete("/deleteProperty/:id/:tableName", async (req, res) => {
  // console.log(req.params);
  // console.log(typeof(parseInt(req.params.id)));
  const id = parseInt(req.params.id);
  const tablename = req.params.tableName;

  if (tablename === "PlotOrLand") {
    var table = await PlotOrLand.findByPk(id);
    unLinkFiles1(table);
    const x = await PlotOrLand.destroy({ where: { _id: req.params.id } });
    console.log(x);
    res.send("1");
  }

  if (tablename === "FlatOrHouse") {
    var table = await FlatOrHouse.findByPk(id);
    unLinkFiles1(table);
    const x = await FlatOrHouse.destroy({ where: { _id: req.params.id } });
    console.log(x);
    res.send("1");
  }

  console.log(table);
});

router.get("/project", async (req, res) => {

  const loc=await Locality.findAll();
  const comp=await Companies.findAll({
    attributes: [
      "_id",
      "companyName"
     ]
  });
  res.render("admin/projects",{data:loc,comp:comp});
});

router.get("/leadsFromWeb", async (req, res) => {
  const allWebLeads = await ClientLead.findAll();
  res.render("admin/Leadsfromwebsite", { data: allWebLeads });
});

router.get("/addComp", async (req, res) => {
  const loc=await Locality.findAll();
  res.render("admin/addCompany",{data:loc});
});

router.post("/createProject", uploads, trimRequest.all, async (req, res) => {
  try {
    let galleryImage = {
      gallery: [],
    };
    let uuid = uniqid.time();
    let tinySrc = "";
    let bigSrc = "";
    let proName = spaceReplacer(req.body.projectName);
    let loc = spaceReplacer(req.body.locality);
    let url = `${proName}-in-${loc}-lucknow-${uuid}`.toLowerCase();
    
    let pd = req.body.projectDetails.trim(); 
   
    if(pd == ""){
       pd = `${req.body.projectName} is a project of ${req.body.companyName} . This Project is Located At ${req.body.projAddress} . ${req.body.projectName} is stabalized by ${req.body.companyName} for selling ${req.body.propType} in very affordable price. The selling price of ${req.body.propType} starts from ${req.body.priceOnwords} Rs  `; 
       } 
    req.files["gallery"].forEach((item) => {
      tinySrc = uniqid() + "-" + item.originalname;
      sharp(item.buffer)
        .resize({ width: 400, height: 265 })
        .toFile("./public/assets/uploads/" + tinySrc)
        .then()
        .catch((err) => {
          logger.error(err);
        });
      bigSrc = uniqid() + "-" + item.originalname;
      sharp(item.buffer)
        .resize({ width: 950, height: 630 })
        .toFile("./public/assets/uploads/" + bigSrc)
        .then()
        .catch((err) => {
          logger.error(err);
        });

      galleryImage.gallery.push({
        smImg: tinySrc,
        bgImg: bigSrc,
      });
    });
    let galleryImageStr = JSON.stringify(galleryImage);
    const project = await Project.create({
      projectName: req.body.projectName,
      url: url,
      projectType: req.body.propType,
      unitOption: req.body.unit,
      priceOnword: req.body.priceOnwords,
      image: galleryImageStr,
      nearByLocation: req.body.facilityDetail,
      address: req.body.projAddress,
      loneAvailability: req.body.loan,
      readyToMove: req.body.ready,
      uuid: uuid,
      projectDetails: pd,
      locality:req.body.locality,
      companyId:req.body.compId
    });
    if ((project._options.isNewRecord = true)) {
      res.send("New project Added.");
    } else {
      res.send("something goes wrong");
    }
  } catch (error) {
    logger.error(error);
    res.send("something goes wrong2");
  }
});
const logouplod = upload.fields([{ name: "logo", maxCount: 1 }]);
router.post('/createComp',logouplod,trimRequest.all, async(req,res)=>{
try{
      let logoImage = {
        logos: []
      };
   let uuid = uniqid.time();
   let companyName=  spaceReplacer(req.body.CompanyName);
   let locality  = spaceReplacer(req.body.locality);
   let url=`${companyName}-in-${locality}-lucknow-${uuid}`;
   let aboutCompany=req.body.aboutCompany.trim();
   if(aboutCompany==""){
   aboutCompany=`${req.body.CompanyName} is well established real estate company in Lucknow. The office address of ${req.body.CompanyName} is in req.body.officeAddress . the company is fully operational in building and selling flats apartments and plots at a very competitive price in Lucknow. You can contact ${req.body.CompanyName} directly by using xyz.com`;

   }
    let tinySrc = "";
    let bigSrc = "";
    // url="";
    req.files["logo"].forEach((item) => {
      tinySrc = uniqid() + "-" + item.originalname;
      sharp(item.buffer)
        .resize({ width: 400, height: 265 })
        .toFile("./public/assets/uploads/" + tinySrc)
        .then()
        .catch((err) => {
          logger.error(err);
        });
      bigSrc = uniqid() + "-" + item.originalname;
      sharp(item.buffer)
        .resize({ width: 950, height: 630 })
        .toFile("./public/assets/uploads/" + bigSrc)
        .then()
        .catch((err) => {
          logger.error(err);
        });

      logoImage.logos.push({
        smLogo: tinySrc,
        bgLogo: bigSrc,
      });
    });
     let logoImageStr = JSON.stringify(logoImage);

    const company =await Companies.create({
      companyName:req.body.CompanyName,
      url:url,
      location:req.body.locality, 
      officeAddress:req.body.officeAddress,
      contactPerson:req.body.cpname,
      contactNumber:req.body.conNumber,
      logos:logoImageStr,
      rearRegiNumber:req.body.rrnumber,
      email:req.body.email,
      aboutCompany:aboutCompany,
      websiteLink:req.body.websiteLink,
      
    });
    if ((company._options.isNewRecord = true)) {
      res.send("New Company Added.");
    } else {
      res.send("something goes wrong");
    }
  } catch (error) {
    logger.error(error);
    res.send("something goes wrong2");
  }
});

router.post("/loadMoreFlatOrHouse", async (req, res) => {
  let limit = parseInt(req.body.limit);
  let start = parseInt(req.body.start);
  let local=req.body.local;
  let whr = req.body.whr;
  let result="";
  if(local == ""){
    console.log("in if");
   result =await FlatOrHouse.findAll({
      attributes: [
        "_id",
        "bedrooms",
        "propType",
        "locality",
        "socityName",
        "bathrooms",
        "BuiltUpArea",
        "expectedPrice",
        "gallery",
        "url",
      ],
      where: {
        propType: whr,
      },
      offset: start,
      limit: limit,
    })

  }else{
    result =await FlatOrHouse.findAll({
      attributes: [
        "_id",
        "bedrooms",
        "propType",
        "locality",
        "socityName",
        "bathrooms",
        "BuiltUpArea",
        "expectedPrice",
        "gallery",
        "url",
      ],
      where: {
        propType: whr,
        locality:local
      },
      offset: start,
      limit: limit,
    })
    
  }
  console.log("locaal ==", result);
  res.send(result);
  
});
router.post("/loadMoreProject", async(req, res) => {
  let limit = parseInt(req.body.limit);
  let start = parseInt(req.body.start);

   let x =await Project.findAll({
    attributes: [
      "_id",
      "projectName",
      "url",
      "projectType",
      "unitOption",
      "address",
      "image",
      "readyToMove",
    ],
    offset: start,
    limit: limit,
  });
  res.send(x);
});


router.get("/addLocalities", (req, res) => {
  res.render("admin/addLocality");
});

router.post("/saveLocality", async (req, res) => {
  
  const a = validateLocality(req.body);
   console.log(a);
  if (a != true) {
    return res.status(200).send(a);
  }
  const locality = await Locality.findOne({
     where: { localityName: req.body.locality } 
    
  });
   console.log(locality);
  if (locality !== null) return res.status(200).send("already exist");
  const loc = await Locality.create({
    localityName: req.body.locality,
  });
  if ((loc._options.isNewRecord = true)) {
    res.send("New locality Added.");
  }
  
});

router.post("/getAllLocality", async (req, res) => {
  const loca = await Locality.findAll();

  if (loca) {
    return res.send(loca);
  }else{
    return res.send("Nothing Found");
  }
});
router.post("/deletingLocality", async (req, res) => {
  const result = await Locality.destroy({
    where: { localityName: req.body.locality }
  });
 
  if (result.n) {
    return res.status(200).send("1");
  } else {
    return res.status(200).send("0");
  }
});



module.exports = router;
