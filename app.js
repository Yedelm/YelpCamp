var express      = require("express"),
    faker        = require("faker"),
    bodyParser   = require("body-parser"),
    app          = express(),
    mongoose     = require("mongoose"),
    Campground   = require("./models/campground"),
    Comment      = require("./models/comment"),
    seedDB       = require("./seeds");
    // Comment      = require("./models/comment"),

seedDB();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost/yelp_camp");

app.get("/",function(req, res){
   res.render("landing"); 
});

//INDEX -- show all campgrounds
app.get("/campgrounds", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
       }
    });
   //
});

//Create -- 
app.post("/campgrounds",function(req, res){
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
app.get("/campgrounds/new", function(req, res) {
   res.render("campgrounds/new"); 
});

//SHOW
app.get("/campgrounds/:id", function(req, res){
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

//===========================
//  COMMENTS ROUTES
//===========================
app.get("/campgrounds/:id/comments/new", function(req, res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
                res.render("comments/new", {campground : campground});
        }
    })
});

app.post("/campgrounds/:id/comments", function(req, res){
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
                   campground.comments.push(comment);
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

app.listen(process.env.PORT, process.env.IP,function(){
   console.log("YelpCamp server has STARTED!") 
});