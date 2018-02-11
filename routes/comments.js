var express = require("express");
var router = express.Router({mergeParams: true});  //so ***id can be found form campground
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Comments new
router.get("/new",isLoggedIn, function(req, res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){  //***id didn't find
        if(err){
            console.log(err);
        } else{
                res.render("comments/new", {campground : campground});
        }
    })
});

//Comments create
router.post("/",isLoggedIn, function(req, res){
   //look up campground by id
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else{
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   //add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   //save comment
                   comment.save();
                   campground.comments.push(comment._id);
                   campground.save();
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
   })
   //create new comment
   //connect new comment to campground
   //redirect
});

//comments edit route
router.get("/:comment_id/edit",checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else{
            //URL id is exist for campground
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//comments update
router.put("/:comment_id",checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            //console.log(err);
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id",checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next){
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
                    res.redirect("back");   
                }
            }
        });
    } else {
        res.redirect("back");   //to previous page
    }
}

module.exports = router;