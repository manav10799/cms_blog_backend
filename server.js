const express = require("express");
const app = express();
const Post = require('./posts');
const Comment = require('./comments');
const db = require('./db');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http')
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://cms-blog-self.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const handler = (req, res) => {
  const d = new Date()
  res.end(d.toString())
}

module.exports = allowCors(handler)

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

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('connection', (data) => {
    io.emit('connection',data);
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
});

app.delete('/blogs/comments/:identifier',(req,res)=> {
    Comment.findOneAndDelete(({identifier: req.params.identifier}), (err,comment)=> {
      if (err) res.status(500).send(err);
      else res.status(200).send({message: 'Comment has been deleted'});
    })
})

server.listen(3001, () => {
  console.log("Initializing Backend for cms blog");
});

module.exports = app;