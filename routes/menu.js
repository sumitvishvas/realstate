const express = require("express");
const db= require("../util/db");
const { FlatOrHouse, PlotOrLand,Project,Companies,Locality } = require("../models/adminModels");
const router = express.Router();
const logger = require("../util/logger");

router.get('/favicon.ico',async (req,res)=>{
  res.render("404");
 });

 router.get("/contact", (req,res)=>{
  res.render("contact");
  
  });
router.get("/about",(req,res)=>{
res.render("about");
});
 
router.get("/", async(req, res) => {
    const loc=await Locality.findAll();
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
        propType: "Apartment",
      },
      order:[['_id','DESC']],
      limit: 8
    });

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
      order:[['_id','DESC']],
      limit: 10
    });

    const allHouses = await FlatOrHouse.findAll({
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
      order:[['_id','DESC']],
      limit: 8
    });
    
  res.render("index",{data:loc,allFlats:allFlats,plots:allPlots,houses:allHouses});
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
      propType: "Apartment",
    },
    limit: 10
  });
  if (allFlats === null) {
    console.log("Not found!");
  } else {
    
    res.render("flats", { data: allFlats,local:"",type:"Apartment" });
  }
});
router.get("/house-for-sale-in-lucknow", async (req, res) => {
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
    limit: 10
  });
  if (allFlats === null) {
    console.log("Not found!");
  } else {
    
    res.render("flats", { data: allFlats ,local:"",type:"House"});
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
    ]
  });
  if (allPlots === null) {
    console.log("Not found!");
  } else {
    
    res.render("plots", { data: allPlots,local:"",type:"plots" });
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
   

      const compProject =  await db.query("select *,com.url as curl from companies as com join projects as proj on com._id=proj.companyId where proj._id='"+singleOne.projectId+"' LIMIT 1 ");

      console.log(compProject[0][0]);

  res.render("flat-details", { data: singleOne,proj:compProject[0][0], msg:msg });
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
    ],
    limit: 6,
  })
    if(project.length !== true){
      res.render("agencies",{data:project});
    }else{
      logger.info("data not found from project table or real-estate-projects-in-lucknow Url ");
  
    }
  
});

router.get('/real-estate-companies-in-lucknow',async (req,res)=>{
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
  
    if(company.length !== 0){
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
  
  const compProject =  await db.query("select *,com.url as curl from companies as com join projects as proj on com._id=proj.companyId where proj.url='"+req.params["id"]+"' LIMIT 1 ");

 
  res.render("agency-Details", { data: compProject[0][0] , msg:msg });
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
  

router.get("/plot-details/:id", async (req, res) => {
  let msg = req.flash("notify");
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }
  const singleOne = await PlotOrLand.findOne({
    where: { url: req.params["id"] },
  });

  const compProject =  await db.query("select *,com.url as curl from companies as com join projects as proj on com._id=proj.companyId where proj._id='"+singleOne.projectId+"' LIMIT 1 ");

 

  res.render("plot-details", { data: singleOne,proj:compProject[0][0], msg:msg });
});





router.get("/:id",async (req,res)=>{
  const url=req.params.id;
   let x=url.split("-in-");
   if(x.length==2){
  let y=x[1];
  y=y.split("-lucknow",1);
  
  let type=x[0];
  let locality=y[0].replace('-'," ");
  if(type =="houses" ){
     let result = await FlatOrHouse.findAll({
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
        locality:locality
      }
    });
    
    res.locals.data=result;
    res.locals.type="House";
  }else if(type =="flats"){
    let result = await FlatOrHouse.findAll({
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
        propType: "Apartment",
        locality:locality
      }
    });
    
    res.locals.data=result;
    res.locals.type="Apartment";
  }else if(type =="plots"){
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
      where:{
        locality:locality
      }
    });
    res.render('plots',{data:allPlots,local:locality,type:"plots"});
    return(0);
  }else{
    res.redirect("/favicon.ico");
  }
  
  
  res.render("flats",{local:locality});
   }else{
    res.redirect("/favicon.ico");
   }
  
});






module.exports = router;