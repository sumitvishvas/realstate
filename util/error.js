const logger= require('./logger');
module.exports=function(err,req,res,next){
   logger.error(err.message,err);
};