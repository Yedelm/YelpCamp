var express      = require("express"),
    faker        = require("faker"),
    bodyParser   = require("body-parser"),
    app          = express(),
    mongoose     = require("mongoose"),
    flash        = require("connect-flash"),
    passport     = require("passport"),
    LocalStrategy= require("passport-local"),
    methodOverride = require("method-override"),
    Campground   = require("./models/campground"),
    Comment      = require("./models/comment"),
    User         = require("./models/user"),
    seedDB       = require("./seeds");
    
    //IMPORT routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

//seedDB();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url);
//mongoose.connect("mongodb://localhost/yelp_camp");   process.env.DATABASEURL
//mongoose.connect("mongodb://<dbuser>:<dbpassword>@ds235418.mlab.com:35418/yelpcamp");

app.locals.moment = require("moment");
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    //name: "Yedelm",
    secret: "My secret",
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //     secure: true
    // }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//run every function, provide username
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes); //append "/campground" to all routes in used file
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP,function(){
   console.log("YelpCamp server has STARTED!") 
});