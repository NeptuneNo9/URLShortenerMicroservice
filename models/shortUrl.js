//Template/structure/model of document for shortUrl

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//mongoose: Express와 MongoDB 연동

var urlSchema = new Schema({
  originalUrl: String,
  shorterUrl: String
}, {timestamps: true}); //know when it was created

const ModelClass = mongoose.model('shortUrl', urlSchema);
//table name, structure

//return
module.exports = ModelClass;
