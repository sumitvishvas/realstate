const Sequelize=  require('sequelize');
const sequelize    = require("../util/db")
const validator= require('validator');

const ClientLead = sequelize.define('ClientLead',{
    _id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    url:{
        type:Sequelize.STRING(1234),
        allowNull:false
    },
    clientEmail:{
        type:Sequelize.STRING,
        allowNull:true
    },
    clientMobileNumber:{
        type:Sequelize.BIGINT(11),
        allowNull:false
    },
    details:{
        type:Sequelize.TEXT('tiny'),
        allowNull:true
    }
    
});

exports.ClientLead=ClientLead;