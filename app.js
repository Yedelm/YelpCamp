var express = require("express");
var faker = require("faker");
var app = express();
var campgrounds = [
        {name: faker.name.findName(), image:"https://farm5.staticflickr.com/4016/4369518024_0f64300987.jpg"},
        {name: faker.name.findName(), image:"https://farm9.staticflickr.com/8302/7820598746_4d8c11899e.jpg"},
        {name: faker.name.findName(), image:"https://farm2.staticflickr.com/1203/1132895352_afd086a60b.jpg"}
    ];

app.set("view engine", "ejs");

app.get("/",function(req, res){
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.listen(process.env.PORT, process.env.IP,function(){
   console.log("YelpCamp server has STARTED!") 
});