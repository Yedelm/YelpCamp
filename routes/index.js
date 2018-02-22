var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Campground = require("../models/campground");
var passport = require("passport");

//root route
router.get("/",function(req, res){
   //res.render("landing"); 
    Campground.find({}, function(err, campgrounds) {
        if(err) {
            console.log(err);
            req.flash("error", err.message);
            return res.render("/");
        }
        res.render("landing", {campgrounds: campgrounds});
    });
});

//show register form
router.get("/register", function(req, res) {
    res.render("register",{page: "register"});
});

//handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           //req.flash("error", err.message);  //coming from passport, empty or error
           return res.render("register", {error: err.message});
       } else{
           passport.authenticate("local")(req, res, function(){ //login user
               req.flash("success", "Welcome to YelpCamp " + user.username);
               res.redirect("/campgrounds");
           });
       }
    });
});

//show login form
router.get("/login", function(req, res) {
   res.render("login", {page: "login"}); 
});

//handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        successFlash: "Successfully logged In",
        failureFlash: true
    }), function(req, res) {
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("success", "Successfully logged out");
    res.redirect("/login");
}

module.exports = router;