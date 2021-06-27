
const Sequelize = require('sequelize');
 const sequelize = require('../util/db');
  const validator = require("validator");

 const User = sequelize.define('user',{
    _id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
       
    },
    password:{ 
        type:Sequelize.STRING,
        allowNull:false
    },
    fullname:{
        type:Sequelize.STRING,
        allowNull:false

    },
    createdBy:{
        type:Sequelize.STRING,
        allowNull:false
    },
    

 });

const validateUser =(User)=>{
   if(!validator.isEmail(User.email))return "Invalid Email";
   else if(!validator.isAlpha(User.fname,'en-GB'))return "Only Alphabate allowed";
   else if(!validator.isAlpha(User.lname ,'en-GB'))return "Only Alphabate allowed";
   return "1"
 }
 exports.User=User;
 exports.validateUser=validateUser;
  