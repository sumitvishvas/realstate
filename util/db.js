const Sequelize  = require('sequelize');
const sequelize=new  Sequelize('baafilac_realEstate' ,'baafilac_rajs01878','uxp[he@KZo-c',{host:'103.224.247.222',
dialect:'mysql'
});


// const sequelize=new  Sequelize('baafilac_realEstate' ,'root','',{host:'localhost',
// dialect:'mysql'
// });



sequelize.authenticate()
.then(()=>{
    console.log(`Connection`);
}).catch(error=>{
    console.log('Error -> '+error);
})
// console.log(sequelize);

module.exports=sequelize;

