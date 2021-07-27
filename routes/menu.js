const express = require("express");
const { where } = require("sequelize");
const { FlatOrHouse, PlotOrLand,Project,Companies } = require("../models/adminModels");
const router = express.Router();
const logger = require("../util/logger");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/flats-in-lucknow", async (req, res) => {
  const allFlats = await FlatOrHouse.findAll({
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
      propType: "House",
    },
  });
  if (allFlats === null) {
    console.log("Not found!");
  } else {
    
    res.render("flats", { data: allFlats });
  }
});

router.get("/plots-in-lucknow", async (req, res) => {
  const allPlots = await PlotOrLand.findAll({
    attributes: [
      "_id",
      "propType",
      "locality",
      "socityName",
      "TotalArea",
      "TotalPrice",
      "gallery",
      "url",
    ],
    // where:{
    //     propType:"Pl"

    // }
  });
  if (allPlots === null) {
    console.log("Not found!");
  } else {
    
    res.render("plots", { data: allPlots });
  }
});

router.get("/property-details/:id", async (req, res) => {
  let msg = req.flash("notify");
  
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }

  const singleOne = await FlatOrHouse.findOne({
    where: { url: req.params["id"] },
  });

  res.render("flat-details", { data: singleOne, msg:msg });
});

router.get('/real-estate-projects-in-lucknow',async (req,res)=>{
  const project = await Project.findAll({
    attributes:[
      "_id",
      "projectName",
      "url",
      "projectType",
      "unitOption",
      "address",
      "image",
      "readyToMove"
    ]
  })
    if(project[0]._options.raw === true){
      res.render("agencies",{data:project});
    }else{
      logger.info("data not found from project table or real-estate-projects-in-lucknow Url ");
  
    }
  
});

router.get('/real-estate-company-in-lucknow',async (req,res)=>{
  const company = await Companies.findAll({
    attributes:[
      "_id",
      "companyName",
      "url",
      "location",
      "contactNumber",
      "officeAddress",
      "logos",
      "contactPerson",
      "aboutCompany",
      "websiteLink",
      "email"
    ]
  })
    if(company[0]._options.raw === true){
      res.render("companies",{data:company});
    }else{
      logger.info("data not found from project table or real-estate-company-in-lucknow Url ");
  
    }
  
});

router.get("/project-details/:id", async (req, res) => {

  let msg = req.flash("notify");
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }
  const projectDetails = await Project.findOne({
    
    where: { url: req.params["id"] }
  });
  console.log(projectDetails);
  res.render("agency-Details", { data: projectDetails, msg:msg });
});
router.get("/company-details/:id", async (req, res) => {

  let msg = req.flash("notify");
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }
  const companyDetails = await Companies.findOne({
    
    where: { url: req.params["id"] }
  });
  console.log(companyDetails);
  res.render("companies-Details", { data: companyDetails, msg:msg });
});
  
router.get("/property-details/:id", async (req, res) => {
  let msg = req.flash("notify");
  
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }

  const singleOne = await FlatOrHouse.findOne({
    where: { url: req.params["id"] },
  });

  res.render("single", { data: singleOne, msg:msg });
});

router.get("/plot-details/:id", async (req, res) => {
  let msg = req.flash("notify");
  console.log("heee heee",msg);
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }
  const singleOne = await PlotOrLand.findOne({
    where: { url: req.params["id"] },
  });

  res.render("plot-details", { data: singleOne, msg:msg });
});


module.exports = router;