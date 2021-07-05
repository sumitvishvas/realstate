const express = require("express");
const { User, validateUser } = require("../models/user");
const spaceReplacer = require("../util/usefulFunctions");
const router = express.Router();
var uniqid = require("uniqid");
const trimRequest = require("trim-request"); 
     const fs  =require("fs");
const { FlatOrHouse, validateFltasOrHouse } = require("../models/Flats");
// const upload= require('../util/fileUpload');
const multer = require("multer");
const sharp = require("sharp");
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
    console.log(flag);
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
    res.render("admin/getFlatsOrHouseTable", { data: flatOrHouses });
    // Its primary key is 123
  }
  // console.log(users.every(user => user instanceof User)); // true
});

router.delete("/deleteProperty/:id", async (req, res) => {
  
  const  flatOrHouse = await FlatOrHouse.findByPk(req.params.id);
  if (flatOrHouse === null) {
    return res.status(200).send('something went wrong !');
  } else {
    let imgSrc= JSON.parse(flatOrHouse.dataValues.gallery);
    console.log('in else');
     
    fs.unlink(`public/assets/uploads/${imgSrc.banner.src}`,(err)=>{
   if(err) return res.send('something went wrong !');
   
   });
  
   for(let i in imgSrc.gallery){
    console.log(`${imgSrc.gallery[i].smImg} === ${imgSrc.gallery[i].bgImg}`);
    fs.unlink(`public/assets/uploads/${imgSrc.gallery[i].smImg}`,(err)=>{
      if(err) return res.send('something went wrong !');
      });
      fs.unlink(`public/assets/uploads/${imgSrc.gallery[i].bgImg}`,(err)=>{
        if(err) return res.send('something went wrong !');
        });

   }
   
  }
  const x = await FlatOrHouse.destroy({ where: { _id: req.params.id } });
  console.log(x);
  res.send('1');
});

module.exports = router;
