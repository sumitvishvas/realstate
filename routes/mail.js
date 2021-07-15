 const express = require('express');
 const router=express.Router();
 const nodemailer = require('nodemailer');
const { ClientLead } = require('../models/clientData');




router.post("/emailClientDetails", async (req,res)=>{
    // console.log("cool ==" ,req.body);
    
    var transporter = nodemailer.createTransport({
      
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: 'rs802381@gmail.com',
        pass: '8957805207'
      }
    });
    
    var mailOptions = {
      from: 'rs802381@gmail.com',
      to: 'rajs01878@gmail.com',
      subject: 'Data From Website',
      html: `Data from webSite  full name = ${req.body.email} <br/> Email Address = ${req.body.monumber} <br/>  mobile number = ${req.body.details}  <br/>   <br/> `
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        // winston.error(error);
         console.log("err",error);
      } else {
        
         succ= {"message":"Thank you for contacting Us – we will get back to you soon!", "status":"success"}
        // winston.info('Email sent: ' + info.response)
        req.flash("notify", succ);
         ClientLead.create({
          url:req.body.url,
          clientEmail:req.body.email,
          clientMobileNumber:req.body.monumber,
          details:req.body.details
        });
       
        return res.redirect('/property-details/'+req.body.url);
      
      }
    });
    
    });


    module.exports=router;