var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

//fix MongoDB depreciation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/Basic-REST-Blog");

//Add this to serve the public folder for CSS
app.use(express.static("public"));

//tell express to use body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(methodOverride("_method"));


//Add this to make .ejs files the default (can leave off the .ejs)
app.set("view engine", "ejs");

//Create Blog Schema
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	//Date.now has a default of the current time
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTful Routes

//Redirect Root to /blogs
app.get("/", function(req, res){
	res.redirect("/blogs");
});

//Index
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs) {
		if(err) {
			console.log(err);
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

//New
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//Create
app.post("/blogs", function(req, res){
	//Create Blog
	Blog.create(req.body.blog, function(err, newBlog){
		if(err) {
			res.render("new");
		} else {
			//Redirect
			res.redirect("/blogs");
		}
	});
});

//Show
app.get("/blogs/:id", function(req, res){
	Blog.find({_id: req.params.id}, function(err, foundBlog) {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog[0]});
		}
	});
});

//Edit
app.get("/blogs/:id/edit", function(req, res){
	Blog.find({_id: req.params.id}, function(err, foundBlog) {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog[0]});
		}
	});
});

//Update
app.put("/blogs/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});


//Destroy
app.delete("/blogs/:id", function(req, res){
	//Destroy Blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		//Redirect - same redirect if successful or not in this case
		if(err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/");
		}
	})
	
});



app.listen(3000, function() {
	console.log("Server is now listening on port 3000");
});