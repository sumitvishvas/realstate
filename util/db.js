const Sequelize  = require('sequelize');

// const sequelize=new  Sequelize('baafilac_realEstate' ,'baafilac_rajs01878','uxp[he@KZo-c',{host:'103.224.247.222',
// dialect:'mysql'
// });


const sequelize=new  Sequelize(process.env.DB_NAME ,process.env.DB_USER,process.env.DB_PASS,{host:process.env.DB_HOST,
dialect:process.env.DB_TYPE
});



// sequelize.authenticate()
// .then(()=>{
//     console.log(`Connection`);
// }).catch(error=>{
//     console.log('Error -> '+error);
// })
// console.log(sequelize);

module.exports=sequelize;

