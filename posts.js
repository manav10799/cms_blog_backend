const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
        id: {type: String},
        title: {type: String,},
        author: {type: String},
        date: {type:Date},
        tags: {type: Array},
        description: {type:String},
        likeCount: {type: Number},
});

module.exports = mongoose.model('Post', PostSchema);