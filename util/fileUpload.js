const multer=require("multer");
const path = require("path");
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,   "./public/assets/uploads");
     
    },
    filename: (req, file, cb) => {
      cb(null,  Date.now()+'-'+file.originalname);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

let upload= multer({ storage: fileStorage,fileFilter: fileFilter  });
// let upload = multer({ dest: './public/images/' });
module.exports=upload;