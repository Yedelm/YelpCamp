var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX -- show all campgrounds
router.get("/", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
       }
    });
});

//Create -- 
router.post("/",function(req, res){
   //get data form form, add to arrary
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var newCampground = {name: name, image:image, description : desc};
   //Create new campground and save to DB
   Campground.create(newCampground, function(err, newCampground){
       if(err){
           console.log(err);
       } else{
            res.redirect("/campgrounds");
       }
   })
});

//NEW -- show the form for new campground
router.get("/new", function(req, res) {
   res.render("campgrounds/new"); 
});

//SHOW
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       } else{
            //render the show template campground page
           res.render("campgrounds/show", {campground : foundCampground});
       }
    });
});

module.exports = router;