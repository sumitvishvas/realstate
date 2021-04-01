let express = require('express');
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use('/',express.static(path.join(__dirname, "public")));

app.get('/', (req, res)=> {
   res.render('index');
  })

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`i am lisening at Port ${port}`);
 
});