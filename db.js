const mongoose = require("mongoose");

const url = `mongodb+srv://manav10799:Iamironman@cluster0.1sit26w.mongodb.net/blogs?retryWrites=true&w=majority`;

const db = mongoose.connect(url, { ssl: true, useNewUrlParser: true,useUnifiedTopology: true }).then(() => {
  console.log("DB CONNECTED");
});

module.exports = db;