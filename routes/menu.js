const express= require('express'); 
const { where } = require('sequelize');
const {FlatOrHouse}  = require("../models/adminModels");
const router=express.Router();

router.get('/', (req, res)=> {
    res.render('index');
   });


   
   router.get('/flats', async (req,res)=>{
    const allFlats= await FlatOrHouse.findAll(
       {
        attributes:[
            "_id",
            "bedrooms",
            "propType",
            "locality",
            "socityName",
            "bathrooms",
            "BuiltUpArea",
            "expectedPrice",
            "gallery",
            "url"
        ],
        where:{
            propType:"House"

        } 
    })
    if (allFlats === null) {
        console.log("Not found!");
      } else {
        console.log("All users:", JSON.stringify(allFlats));
        res.render("flats", { data: allFlats });
        
      }  
   });

   router.get('/:id',async(req,res)=>{
    

   });

   module.exports=router;