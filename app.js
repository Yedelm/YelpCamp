var express      = require("express"),
    faker        = require("faker"),
    bodyParser   = require("body-parser"),
    app          = express(),
    mongoose     = require("mongoose");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/yelp_camp");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name : String,
    image : String,
    description: String
});
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: faker.name.findName(),
//     image:"https://farm2.staticflickr.com/1203/1132895352_afd086a60b.jpg",
//     description: "This is a huge place, but no bathrooms.  no water. "
// }, function(err, campground){
//     if(err){
//         console.log(err);
//     }   else{
//         console.log("Newly created campground: ");
//         console.log(campground);
//     }
// });


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
            res.render("index", {campgrounds: allCampgrounds});
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

//NEW -- show the form for new campgroumd
app.get("/campgrounds/new", function(req, res) {
   res.render("new"); 
});

//SHOW
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id,function(err, foundCampground){
       if(err){
           console.log(err);
       } else{
            //render the show template campground page
           res.render("show", {campground : foundCampground});
       }
    });
});

app.listen(process.env.PORT, process.env.IP,function(){
   console.log("YelpCamp server has STARTED!") 
});