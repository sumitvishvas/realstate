
const express = require("express");

const fs=require('fs');


const { FlatOrHouse, validateFltasOrHouse,PlotOrLand, validatePlotsOrLand,Project,Companies } = require("../models/adminModels");


// Flats,Plot Unlink all images function

const unLinkFiles1=async function(table){
   
    let imgSrc= JSON.parse(table.dataValues.gallery);
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



module.exports={
  unLinkFiles1
};
