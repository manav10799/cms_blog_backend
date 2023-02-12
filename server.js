const express = require("express");
const app = express();
const Post = require('./posts');
const Comment = require('./comments');
const db = require('./db');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

// Get Api Calls
// Data.find method is used to retrieve all data from the MongoDB collection and return it as the response to the GET request
app.get('/blogs/posts', (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(posts);
  }); 
});

app.get("/blogs/posts/:id", (req, res) => {
  Post.find(({id: req.params.id}), (err, post) => {
    if (err) res.status(500).send(err);
    else if (!post) res.status(404).send("Item not found");
    else res.send(post);
  }); 
});

//post api call
//.save() method of the model is then used to save the data to the collection
app.post("/blogs/posts", (req, res) => {
  const newPosts = new Post(req.body);
  newPosts.save((err, item) => {
    if (err) res.status(500).send(err);
    else res.send(item);
  });
});

app.get("/blogs/comments/:id", (req,res) => {
  Comment.find(({id: req.params.id}),(err,comment) => {
    if (err) return res.status(400).send(err);  
    res.status(200).send(comment);
  })
})

app.post("/blogs/comments", (req, res) => {
    const comments = new Comment(req.body);
    comments.save((err,item) => {
      if (err) res.status(500).send(err);
      else res.send(item);
    })
});

// put api call
// By using Data.findOneAndUpdate(), you can update a single document in the MongoDB collection with the specified id.

app.put("/blogs/posts/:id",(req,res) => {
    const updatedItem = new Post(req.body);
    Post.findOneAndUpdate(({id:req.params.id}), updatedItem, { new: true }, (err, data) => {
      if (err) return res.status(500).send(err);
      return res.send(data);
    });
})

app.listen(3001, () => {
  console.log("Initializing Backend for cms blog");
});

module.exports = app;