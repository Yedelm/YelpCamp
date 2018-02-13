//all middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //is user loged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                //dose use own the post,  use mongoose's equals() instead of
                //if(foundCampground.author.id === req.user._id)  req.use._id is string，found... is object
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");   
                }
            }
        });
    } else {
        req.flash("error", "YOU NEED TO BE LOGGED IN TO DO THAT");
        res.redirect("back");   //to previous page
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    //is user loged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                //dose use own the post,  use mongoose's equals() instead of
                //if(foundCampground.author.id === req.user._id)  req.use._id is string，found... is object
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");   
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");   //to previous page
    }
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //Key "error" is used in the route to call the flash.
    req.flash("error", "YOU NEED TO BE LOGGED IN TO DO THAT");  //do this before redirect
    res.redirect("/login");
}


module.exports = middlewareObj;