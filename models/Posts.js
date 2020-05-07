const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostsSchema = new Schema({

        user:{
            type: Schema.Types.ObjectID,
            ref: 'users'
        },
        text:{
            type: String,
            required: true
        },
        name:{
            type:String
        },
        avatar:{
            type: String
        },
        likes:[
            {
                user:{
                    type: Schema.Types.ObjectID,
                    ref: 'users'
                }
            }
        ],
        comments:[
            {
                user:{
                    type: Schema.Types.ObjectID,
                    ref: 'users'
                },
                text:{
                    type: String,
                    required: true
                },
                name:{
                    type:String
                },
                avatar:{
                    type: String
                },
                date:{
                    type: Date,
                    default: Date.now
                }
            }
        ]


});


module.exports = Post = mongoose.model('post',PostsSchema);