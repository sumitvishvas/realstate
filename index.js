require('dotenv').config();
require('express-async-errors');
let express = require('express');
const path = require("path");
const app = express();
const flash=  require('connect-flash');
const session = require('express-session');
const sequelize= require('./util/db');
const user= require('./models/user');
const logger=require('./util/logger');
app.set("view engine", "ejs");
app.set("views", "./views");
let menuRouter=require('./routes/menu');
const mailRouter=require('./routes/mail');
const adminRouter=require('./routes/admin');
const users=require('./routes/usersAdmin');
const errors=require('./util/error');
app.use(flash());
app.use(session({
  secret:'goodone@123',
  resave: false,
   saveUninitialized:false
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/',express.static(path.join(__dirname, "public")));
app.use('/property-details',express.static(path.join(__dirname, "public")));
app.use('/project-details',express.static(path.join(__dirname, "public")));
app.use('/company-details',express.static(path.join(__dirname, "public")));
app.use('/plot-details',express.static(path.join(__dirname, "public")));
app.use('/admin', express.static(path.join(__dirname, 'adminPublic')));
app.use('/users', express.static(path.join(__dirname, 'adminPublic')));
app.use('/', menuRouter);
app.use("/admin",adminRouter);
app.use('/mail',mailRouter);
app.use('/users',users);
app.use(errors);
sequelize.sync().then(result=>{
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`i am lisening at Port ${port}`);
  });
}).catch(err=>{
  logger.error(err);
});

