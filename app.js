var express = require("express");
var faker = require("faker");
var bodyParser = require("body-parser");
var app = express();
var campgrounds = [
        {name: faker.name.findName(), image:"https://farm5.staticflickr.com/4016/4369518024_0f64300987.jpg"},
        {name: faker.name.findName(), image:"https://farm9.staticflickr.com/8302/7820598746_4d8c11899e.jpg"},
        {name: faker.name.findName(), image:"https://farm2.staticflickr.com/1203/1132895352_afd086a60b.jpg"}
    ];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req, res){
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds",function(req, res){
   //get data form form, add to arrary
   var name = req.body.name;
   var image = req.body.image;
   var newCampground = {name: name, image:image};
   campgrounds.push(newCampground);
   //redirect back to campground page
   res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
   res.render("new"); 
});

app.listen(process.env.PORT, process.env.IP,function(){
   console.log("YelpCamp server has STARTED!") 
});