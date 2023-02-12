const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
      id: {type: String},
      comments: {type: String},
      author: {type: String},
      date: {type: Date},
      profileImage: {type: String}
});

module.exports = mongoose.model('Comment', CommentSchema);
