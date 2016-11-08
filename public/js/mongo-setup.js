var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var fs = require('fs');

var url = 'mongodb://localhost:27017/challenge';

MongoClient.connect(url, function (err, db) {
  var productsJson = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
  db.collection('products').insert(productsJson.products, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log('First Insert:', result.length, result);
    }
    db.close();
  });
});
