const mongoose = require('mongoose');


const postSchema = ({
    content:{
        type: String,
        required: true
    },
     user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: User
     }
},{
    timestamps: true
});

const Post = mongoose.model('POST', postSchema);

module.exports = Post;