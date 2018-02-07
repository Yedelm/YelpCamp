var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Spicy jalapeno bacon ipsum dolor amet velit short ribs meatball ribeye cow. Dolor in commodo ribeye sausage cow ex sirloin. Shoulder ut bacon cillum, andouille chuck proident ea pork chop enim kevin ball tip dolor. Ham prosciutto elit, id occaecat in swine cupidatat adipisicing spare ribs turkey velit dolor fatback. Commodo picanha deserunt laboris pork ut eu. Pariatur ut cow ut cupim. Lorem tempor commodo rump ham hock pig sed anim nostrud mollit."
    },
    {
        name: "Desert Mesa", 
        image: "https://farm5.staticflickr.com/4016/4369518024_0f64300987.jpg",
        description: "Spicy jalapeno bacon ipsum dolor amet velit short ribs meatball ribeye cow. Dolor in commodo ribeye sausage cow ex sirloin. Shoulder ut bacon cillum, andouille chuck proident ea pork chop enim kevin ball tip dolor. Ham prosciutto elit, id occaecat in swine cupidatat adipisicing spare ribs turkey velit dolor fatback. Commodo picanha deserunt laboris pork ut eu. Pariatur ut cow ut cupim. Lorem tempor commodo rump ham hock pig sed anim nostrud mollit."
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Spicy jalapeno bacon ipsum dolor amet velit short ribs meatball ribeye cow. Dolor in commodo ribeye sausage cow ex sirloin. Shoulder ut bacon cillum, andouille chuck proident ea pork chop enim kevin ball tip dolor. Ham prosciutto elit, id occaecat in swine cupidatat adipisicing spare ribs turkey velit dolor fatback. Commodo picanha deserunt laboris pork ut eu. Pariatur ut cow ut cupim. Lorem tempor commodo rump ham hock pig sed anim nostrud mollit."
    }
]

function seedDB(){
    //remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } 
        console.log("removed campground");
        Comment.remove({}, function(err){
            if(err){
                console.log(err);
            }
            console.log("comments removed");
            //add new campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                   if(err){
                       console.log(err);
                   } else{
                        console.log("Added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is greate, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else{
                                    campground.comments.push(comment._id);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                   }
                });
            });
        });
    });
}

module.exports = seedDB;