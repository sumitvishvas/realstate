 const Sequelize = require('sequelize');
 const sequelize=require('../util/db');
 const validator= require('validator');

 const FlatOrHouse = sequelize.define('flatOrHouse',{
          
    _id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
      
    },
    url:{
        type:Sequelize.STRING(1234),
        allowNull:false
    },
    socityName:{
        type: Sequelize.STRING,
        allowNull:false
    },
    locality:{
        type:Sequelize.STRING,
        allowNull:false
    },
    flatOrHouseNum:{
        type: Sequelize.STRING,
        allowNull:false
    },
    propType:{
        type : Sequelize.STRING,
        allowNull:false
    },
    totalFloor:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    bedrooms:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    balconies:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    bathrooms:{
        type: Sequelize.STRING,
        allowNull:false
    },
    BuiltUpArea:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    otherRooms:{
       type:Sequelize.STRING,
       allowNull:false 
    },
    furnishing:{
        type:Sequelize.STRING,
        allowNull:false
    },
    ameneties:{
        type:Sequelize.STRING(1234),
        allowNull:false
    },
    expectedPrice:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    priceNegotiable:{
        type: Sequelize.STRING,
        allowNull:false
    },
    propDetails:{
        type:Sequelize.TEXT('tiny'),

    },
    gallery:{
        type:Sequelize.STRING(1234),
        
    },
    videoLink:{
        type:Sequelize.STRING,
    },
    uuid:{
       type:Sequelize.STRING,
       allowNull:false 
    }
 });
 const validateFltasOrHouse = (FlatOrHouse) => {
    if(!validator.isEmpty(FlatOrHouse.societyName))return "Society Name required !";
    else if(!validator.isEmpty(FlatOrHouse.locality))return "Please fill locality !";
    else if(!validator.isEmpty(FlatOrHouse.flatOrHouseNum))return "Flat Or House Number required !"
     return true; 
 }

 const PlotOrLand=sequelize.define('plotOrLand', {

    _id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true

    },
    url:{
        type:Sequelize.STRING(1234),
        allowNull:false
    },
    socityName:{
        type: Sequelize.STRING,
        allowNull:false
    },
    locality:{
        type:Sequelize.STRING,
        allowNull:false
    },
    plotOrLandNum:{
        type: Sequelize.STRING,
        allowNull:false
    },
     propType:{
        type : Sequelize.STRING,
        allowNull:false
    },
       TotalArea:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    TotalPrice:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    priceNegotiable:{
        type: Sequelize.STRING,
        allowNull:false
    },
    propDetails:{
        type:Sequelize.TEXT('tiny'),

    },
    gallery:{
        type:Sequelize.STRING(1234),
        
    },
    videoLink:{
        type:Sequelize.STRING,
    },
    uuid:{
       type:Sequelize.STRING,
       allowNull:false 
    }
    
});

 const validatePlotsOrLand = (PlotOrLand) => {
    if(!validator.isEmpty(PlotOrLand.societyName))return "Society Name required !";
    else if(!validator.isEmpty(PlotOrLand.locality))return "Please fill locality !";
    else if(!validator.isEmpty(PlotOrLand.plotOrLandNum))return "Plot Or Land Number required !"

    return true; 
 }

 const Companies = sequelize.define('companies',{
    _id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    companyName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    officeAddress:{
        type:Sequelize.STRING(1234),
        allowNull:false
    },
    aboutCompany:{
        type:Sequelize.TEXT('tiny'),
        allowNull:true
    },
    contactPerson:{
        type:Sequelize.STRING,
        allowNull:false
    },
    contactNumber:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:true
    },
    rearRegiNumber:{
        type:Sequelize.STRING,
        allowNull:true
    },
    websiteLink:{
        type:Sequelize.STRING,
        allowNull:true
    },
    gallery:{
        type:Sequelize.TEXT('tiny'),
        allowNull:true
    },
    location:{
        type:Sequelize.STRING,
        allowNull:true
    }

 });


  const Project=sequelize.define('project', {

    _id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true

    },
     projectName:{
        type: Sequelize.STRING,
        allowNull:false
    },
    url:{
        type:Sequelize.STRING(1234),
        allowNull:false
    },
     projectType:{
        type: Sequelize.STRING,
        allowNull:false
    },
    unitOption:{
        type: Sequelize.STRING,
        allowNull:false
    },
    priceOnword:{
        type:Sequelize.STRING,
        allowNull:false
    },
   
     image:{
        type : Sequelize.STRING(1234),
        allowNull:false
    },
       
    nearByLocation:{
        type: Sequelize.STRING,
        allowNull:false
    },
    address:{
        type:Sequelize.TEXT('tiny'),
        allowNull:false

    },
    loneAvailability:{
        type:Sequelize.STRING(1234),
        allowNull:false
        
    },
    readyToMove:{
        type:Sequelize.STRING,
        allowNull:false
    },
    uuid:{
       type:Sequelize.STRING,
       allowNull:false 
    },
    projectDetails:{
        type:Sequelize.STRING,
        allowNull:false
    }
    
});
exports.Project=Project;

 exports.PlotOrLand=PlotOrLand;
 exports.validatePlotsOrLand=validatePlotsOrLand;

 exports.FlatOrHouse=FlatOrHouse;
 exports.validateFltasOrHouse=validateFltasOrHouse;
 exports.Companies=Companies;