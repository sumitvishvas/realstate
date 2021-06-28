const express= require('express'); 
const { where } = require('sequelize/types');
const {FlatOrHouse}  = require("../models/Flats");
const router=express.Router();

router.get('/', (req, res)=> {
    res.render('index');
   });


   
   router.get('/flats',(req,res)=>{
    const allFlats= FlatOrHouse.findAll(
       {
        attributes:[
            

        ],
        where:{
            propType:House

        }
        
        
       }
    )

       res.render('flats');

   });

   module.exports=router;