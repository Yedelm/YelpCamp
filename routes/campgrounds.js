var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");   //index.js is special, will automatically loaded

//INDEX -- show all campgrounds
router.get("/", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page:"campgrounds"});
       }
    });
});

//Create -- 
router.post("/", middleware.isLoggedIn, function(req, res){
  //get data form form, add to arrary
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var newCampground = {name: name, price: price,image:image,description:desc,author:author};
 
  //Create new campground and save to DB
  Campground.create(newCampground, function(err, newCampground){
      if(err){
          console.log(err);
      } else{
            res.redirect("/campgrounds");
      }
  });
});

//NEW -- show the form for new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
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

//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
   //find and update the correct campground, mongo's method
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else{
           res.redirect(("/campgrounds/" + req.params.id));
       }
   });
});

//Delete campgrounds
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;