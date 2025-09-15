const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const authTokenSchem = new Schema({
    token : {type : String,required : true},
    clientId : {type : String,required : true},
    revoked : {type: Boolean,required : true},
    createdAt : {type : Date,required : true},
});

module.exports = mongoose.model('AuthToken',authTokenSchem);