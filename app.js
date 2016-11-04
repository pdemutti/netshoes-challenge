var express = require('express');
var fs = require('fs');
var app = express();

var database = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));

app.use(express.static('public'));

app.get('/products', function(request, response){
  response.json(database);
});

app.delete('/product/:id', function(request, response) {
  database.products = database.products.filter(function(index) {
    return index.id != request.params.id;
  });
  response.json(database);
});

var port = process.env.PORT || 3001;
app.listen(port, function() {
  console.log('Listening on 3001');
});
