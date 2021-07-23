const express = require("express");
const { where } = require("sequelize");
const { FlatOrHouse, PlotOrLand } = require("../models/adminModels");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/flats", async (req, res) => {
  const allFlats = await FlatOrHouse.findAll({
    attributes: [
      "_id",
      "bedrooms",
      "propType",
      "locality",
      "socityName",
      "bathrooms",
      "BuiltUpArea",
      "expectedPrice",
      "gallery",
      "url",
    ],
    where: {
      propType: "House",
    },
  });
  if (allFlats === null) {
    console.log("Not found!");
  } else {
    // console.log("All users:", JSON.stringify(allFlats));
    res.render("flats", { data: allFlats });
  }
});

router.get("/plots", async (req, res) => {
  const allPlots = await PlotOrLand.findAll({
    attributes: [
      "_id",
      "propType",
      "locality",
      "socityName",
      "TotalArea",
      "TotalPrice",
      "gallery",
      "url",
    ],
    // where:{
    //     propType:"Pl"

    // }
  });
  if (allPlots === null) {
    console.log("Not found!");
  } else {
    // console.log("All users:", JSON.stringify(allPlots));
    res.render("plots", { data: allPlots });
  }
});

router.get("/property-details/:id", async (req, res) => {
  let msg = req.flash("notify");
  console.log("heee heee",msg);
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }

  const singleOne = await FlatOrHouse.findOne({
    where: { url: req.params["id"] },
  });

  res.render("single", { data: singleOne, msg:msg });
});

router.get("/property-details/:id", async (req, res) => {
  let msg = req.flash("notify");
  console.log("heee heee",msg);
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }

  const singleOne = await FlatOrHouse.findOne({
    where: { url: req.params["id"] },
  });

  res.render("single", { data: singleOne, msg:msg });
});

router.get("/plot-details/:id", async (req, res) => {
  let msg = req.flash("notify");
  console.log("heee heee",msg);
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }

  const singleOne = await PlotOrLand.findOne({
    where: { url: req.params["id"] },
  });

  res.render("single2", { data: singleOne, msg:msg });
});


module.exports = router;
