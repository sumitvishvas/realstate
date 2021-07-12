let express = require('express');
const path = require("path");

const app = express();

const sequelize= require('./util/db');
const user= require('./models/user');
app.set("view engine", "ejs");
app.set("views", "./views");
let menuRouter=require('./routes/menu');
const adminRouter=require('./routes/admin');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/',express.static(path.join(__dirname, "public")));
app.use('/property-details',express.static(path.join(__dirname, "public")));
app.use('/admin', express.static(path.join(__dirname, 'adminPublic')));

app.use('/', menuRouter);
app.use("/admin",adminRouter);

sequelize.sync().then(result=>{
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`i am lisening at Port ${port}`);
   
  });
}).catch(err=>{
  console.log(err);
});

