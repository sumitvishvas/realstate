const express = require("express");
const { User, validateUser } = require("../models/user");
const {ClientLead}=require("../models/clientData");
const spaceReplacer = require("../util/usefulFunctions");
const router = express.Router();
var uniqid = require("uniqid");
const trimRequest = require("trim-request"); 
const fs =require("fs");
const sequelize = require('sequelize');
const { FlatOrHouse, validateFltasOrHouse,PlotOrLand, validatePlotsOrLand,Project,Companies } = require("../models/adminModels");
const{unLinkFiles1}=require('../util/fileUnlink');
const multer = require("multer");
const sharp = require("sharp");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const logger = require('../util/logger')

router.get("/realAdmin", (req, res) => {
  res.redirect("/admin/dashboard");
});

router.get("/dashboard", (req, res) => {
  res.render("admin/index");
});

router.get("/login", (req, res) => {
  let msg = "";
  res.render("admin/sign-in", { msg: msg });
});

router.get("/registerUser", (req, res) => {
  res.render("admin/createUser");
});

router.post("/registerUser", async (req, res) => {
  let flag = validateUser(req.body);
  if (flag !== "1") {
    
    return res.redirect("/admin/registerUser");
  }

  const user = await User.findOne({ where: { email: req.body.email } });
  if (user !== null) {
    console.log("in f");
    return res.redirect("/admin/registerUser");
  }

  req.body.fullname = req.body.fname + " " + req.body.lname;

  User.create({
    email: req.body.email,
    fullname: req.body.fullname,
    password: req.body.password,
    createdBy: "Raj",
  })
    .then((result) => {
      console.log("created ");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/createFlate", (req, res) => {
  res.render("admin/createFlate");
});

router.get("/createPlot_Land", (req, res) => {
  res.render("admin/createPlot_Land");
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
    let type =
      req.body.propType === "Apartment" ? "flat-Apartment" : req.body.propType;
    let uuid = uniqid.time();
    let url = `${req.body.bedrooms}bhk-${type}-for-sale-in-${soci}-${local}-lucknow-built-up-area-${req.body.BuiltUpArea}-square-feet-${uuid}`;
    url = url.toLowerCase();
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
      propDetails: req.body.propDetails,
      gallery: galleryImageStr,
      videoLink: req.body.videoLink,
      uuid: uuid,
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
    let soci = spaceReplacer(req.body.societyName);
    let local = spaceReplacer(req.body.locality);
    let type =
      req.body.propType === "Commercial" ? "Residential" : req.body.propType;
    let uuid = uniqid.time();
    let url = `${type}-Plots-for-sale-in-${soci}-${local}-lucknow-built-up-area-${req.body.TotalArea}-square-feet-offered-price-${req.body.TotalPrice}-rs-${uuid}`;
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
      propDetails: req.body.propDetails,
      gallery: galleryImageStr,
      videoLink: req.body.videoLink,
      uuid: uuid,
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
    res.render("admin/getFlatsOrHouseTable", { data: flatOrHouses ,tableName:'FlatOrHouse'});
    // Its primary key is 123
  }
  // console.log(users.every(user => user instanceof User)); // true
});
router.get("/getplotsorlanddata", async(req,res)=>{
  res.render("admin/getPlotsOrLandTable",{tableName:'PlotOrLand'});
})

  router.post("/plotLandData", async(req, res) =>{
//     console.log(req.body);
    
// console.log(req.body.search.value);
var tableName=req.body.tableName;

   
        // Coming from databale itself. Limit is the visible number of data
    var limit = parseInt(req.body.length);
    var start = parseInt(req.body.start);
    var order = req.body.order;
     var search = req.body.search;
     var search =search.value
   
// console.log(order);



 var col = '';
    var dir = "";
    var o = "";

    if (Array.isArray(order) && order.length) {
      order.forEach(o=>{
        col = o['column'];
        dir = o['dir'];
      })
    }
    if (dir !== 'asc' && dir !== 'desc') {
      dir = 'desc';
    }

    // console.log(`${dir}`);

        var columns = {
      
      0 : '_id',
      1 : '_id',
      2 :  "propType",
      3 : "socityName",
      4 : "locality",
      
      5 : "TotalArea",
      6 :"TotalPrice",
      7 :"url",
     
        }
        console.log(columns[0]);

    if (columns[col]) {
      order = columns[col];
    } else {
      order = null;
    }

    // console.log(order);

if( search !==''){
  // console.log(search);
 var plotOrLand = await PlotOrLand.findAll({
    
  where: {
  [sequelize.Op.or]:{   
     _id:{ [sequelize.Op.like]: '%' + search + '%' },
    propType: { [sequelize.Op.like]: '%' + search + '%' },
    socityName: { [sequelize.Op.like]: '%' + search + '%' },
    locality: { [sequelize.Op.like]: '%' + search + '%' },
    TotalArea: { [sequelize.Op.like]: '%' + search + '%' },
    TotalPrice: { [sequelize.Op.like]: '%' + search + '%' },   
  }
  },
   order: [
            [order, dir],
            
        ],
    offset:start,
    limit : limit,

});
}else{
  
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
    order: [
            [order, dir],
            
        ],
    offset:start,
    limit : limit,
  });
}
 
var TotalData=await PlotOrLand.findAll({
    attributes: ['_id', [sequelize.fn('count', sequelize.col('_id')), 'count']],
    // group : ['plotOrLand._id'],
    raw: true,
    order: sequelize.literal('count DESC')
  });
  var TotalRows =TotalData[0].count;
  console.log(`TotalDATA -> ${TotalRows}`);
  // console.log(count[0].count);
  var Data=[];
  plotOrLand.forEach((data,index)=>{
// console.log(data.locality+"  "+(index+1));
var id=data._id;
var uuid=data.uuid;
var propType=data.propType;
var socityName=data.socityName;
var locality=data.locality;
var TotalPrice=data.TotalPrice;
var TotalArea=data.TotalArea;
var url=data.url;

var nestedData={
'#':index+1,
'id':id,
'propType':propType,
'socityName':socityName,
'locality':locality,
'TotalPrice':TotalPrice,
'TotalArea':TotalArea,
'view':`<td><a href="" target="_blank"> <i class="fa fa-external-link" aria-hidden="true"></i></a></td>`,
'edit':`<td><button class="btn-success btn " onclick="editTour()" >Edit</button></td>`,
'delete':`<td><button class="btn btn-danger" onclick="deleteProperty('${id}','${tableName}')">Delete</button></td>`
}


Data.push(nestedData);

// Data =nestedData;
// console.log(Data);


 
  });
//   console.log(`DATA`);
// console.log(Data);
  
   var table_data = JSON.stringify({
                        "draw": req.body.draw,
                        "recordsFiltered": parseInt(TotalRows),
                        "recordsTotal": parseInt(TotalRows),
                        "data": Data
                    });
  res.send(table_data);
  // console.log(table_data);
  


});

 



router.delete("/deleteProperty/:id/:tableName", async (req, res) => {

  
  
  // console.log(req.params);
  // console.log(typeof(parseInt(req.params.id)));
  const id=parseInt(req.params.id);
  const tablename=req.params.tableName;
    
  if(tablename==='PlotOrLand'){
      
var table = await PlotOrLand.findByPk(id);
unLinkFiles1(table);
   const x = await PlotOrLand.destroy({ where: { _id: req.params.id } });
  console.log(x);
  res.send('1');
  }

  if(tablename==='FlatOrHouse'){
     
var table = await FlatOrHouse.findByPk(id);
unLinkFiles1(table);
const x = await FlatOrHouse.destroy({ where: { _id: req.params.id } });
  console.log(x);
  res.send('1');
  }
   

  console.log(table);
  
  
});

router.get("/project", async(req,res)=>{
  res.render('admin/projects');
})


router.get("/leadsFromWeb", async(req,res)=>{
  const allWebLeads= await ClientLead.findAll();
  res.render("admin/Leadsfromwebsite",{data:allWebLeads});
});

router.get("/addComp",async(req,res)=>{
res.render("admin/addCompany");

});

router.post("/createProject",uploads, trimRequest.all,async(req,res)=>{

  console.log("cool",req.body.projectName);
  
  try {
  
  let galleryImage = {
    gallery: []
  };
  let uuid = uniqid.time();
    let tinySrc = "";
    let bigSrc = "";
   let proName = spaceReplacer(req.body.projectName);
   let projAddr=spaceReplacer(req.body.projAddress);
    url=`${proName}-in-${projAddr}-lucknow-${uuid}`;
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
    const project =await Project.create({
      projectName:req.body.projectName,
      url:url,
      projectType:req.body.propType,
      unitOption:req.body.unit,
      priceOnword:req.body.priceOnwords,
      image:galleryImageStr,
      nearByLocation:req.body.facilityDetail,
      address:req.body.projAddress,
      loneAvailability:req.body.loan,
      readyToMove:req.body.ready,
      uuid:uuid,
      projectDetails:req.body.projectDetails

    });
 if(project._options.isNewRecord = true){
  res.send("New project Added.");
 }else{
   res.send("something goes wrong");
 }
     
  } catch (error) {
    logger.error(error);
    res.send("something goes wrong2");
  }
});
const logouplod = upload.fields([{ name: "logo", maxCount: 1 }]);
router.post('/createComp',logouplod,trimRequest.all, async(req,res)=>{
  
try {
  
  let logoImage = {
    logos: []
  };
  // let uuid = uniqid.time();
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
      location:req.body.location,
     
      officeAddress:req.body.officeAddress,
      contactPerson:req.body.cpname,
      contactNumber:req.body.conNumber,
      logos:logoImageStr,
      rearRegiNumber:req.body.rrnumber,
      email:req.body.email,
      aboutCompany:req.body.aboutCompany,
      websiteLink:req.body.websiteLink,
      
    });
 if(company._options.isNewRecord = true){
  res.send("New Company Added.");
 }else{
   res.send("something goes wrong");
 }
     
  } catch (error) {
    logger.error(error);
    res.send("something goes wrong2");
  }

})







module.exports = router;
