const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (Make sure you have MongoDB installed and running)
mongoose.connect("mongodb://localhost:27017/blog-website", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set up EJS as the view engine
app.set("view engine", "ejs");

// Body parser middleware
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static("public"));

// Define MongoDB schema and model (blog post)
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Blog = mongoose.model("Blog", blogSchema);

// Routes
app.get("/", (req, res) => {
  // Fetch all blog posts from the database
  Blog.find({})
    .exec()
    .then((blogs) => {
      res.render("home", { blogs: blogs });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/blogs/:id", (req, res) => {
  const blogId = req.params.id;
  // Fetch a specific blog post from the database
  Blog.findById(blogId)
    .exec()
    .then((blog) => {
      res.render("blog", { blog: blog });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create", (req, res) => {
  // Create a new blog post in the database
  const newBlog = new Blog({
    title: req.body.title,
    content: req.body.content,
  });

  newBlog.save()
    .then((blog) => {
      res.redirect('/');
    })
    .catch((err) => {
      console.error(err);
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
