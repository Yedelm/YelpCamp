var express      = require("express"),
    faker        = require("faker"),
    bodyParser   = require("body-parser"),
    app          = express(),
    mongoose     = require("mongoose"),
    passport     = require("passport"),
    LocalStrategy= require("passport-local"),
    Campground   = require("./models/campground"),
    Comment      = require("./models/comment"),
    User         = require("./models/user"),
    seedDB       = require("./seeds");
    
    //IMPORT routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

seedDB();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost/yelp_camp");

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//run every function, provide username
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes); //append "/campground" to all routes in used file
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP,function(){
   console.log("YelpCamp server has STARTED!") 
});