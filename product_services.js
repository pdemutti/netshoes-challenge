var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/challenge';


exports.findProductById = function (id, callback){
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('products');
    if (err) {
    } else {
      collection.find({id: id}).toArray(function (err, result) {
       if (err) {
         callback(true, null);
       } else if (result.length) {
         callback(false, result[0]);
       } else {
         callback(false, null)
       }
       db.close();
     });
    }
  });
}
