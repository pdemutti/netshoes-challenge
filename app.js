var express = require('express');
var fs = require('fs');
var cookieParser = require('cookie-parser')
var app = express();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/challenge';
app.use(express.static('public'));

app.use(cookieParser());

app.get('/allproducts', function(request, response){

  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('products');
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {

      collection.find({}).toArray(function (err, result) {
       if (err) {
         console.log(err);
       } else if (result.length) {
        //  console.log('Found:', result);
        response.json(result);
       } else {
         console.log('No document(s) found with defined "find" criteria!');
       }
       db.close();
     });
    }
  });
});

app.get('/product/:id', function(request, response){
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('products');
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      var id =  parseInt(request.params.id);
      console.log("request.params.id = " + id )
      collection.find({id: id}).toArray(function (err, result) {
       if (err) {
         console.log(err);
       } else if (result.length) {
         response.json(result);

       } else {
         console.log('No document(s) found with defined "find" criteria!');
         response.json(null);
       }
       db.close();
     });
    }
  });
});


app.get('/cart/', function(request, response){
  var cartId = request.cookies.cart;
  console.log("cart " + cartId)
  findCartById(cartId, function(error, cart){
    if (cart){
      response.json(cart);
    }
    else {
      response.json({"items": []})
    }
  });

});

app.get('/cart/add/:id', function(request, response){
  var id =  parseInt(request.params.id);
  var cartId = request.cookies.cart;

  console.log("cart " + cartId)

  findProductById(id, function(error, product){
    if (product){
      var cartItem = {
        "id":  product.id,
        "title":  product.title,
        "image":  product.image,
        "availableSizes":  product.availableSizes

      }
      addToCart(cartId, cartItem, function(error, cart){
        if (cart._id){
          response.cookie('cart', cart._id, { maxAge: 900000, httpOnly: true });
        }
        response.json(cart);
      })
    }
    else {
      response.json({"error": "product id " + request.params.id + " not found!"});
    }
  });
});

function findProductById(id, callback){
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('products');
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      collection.find({id: id}).toArray(function (err, result) {
       if (err) {
         callback(true, null);
       } else if (result.length) {
         callback(false, result[0]);
       } else {
         console.log('No document(s) found with defined "find" criteria!');
         callback(false, null)
       }
       db.close();
     });
    }
  });
}

function addToCart(cartId, cartItem, callback){
  findCartById(cartId, function(error, cart){
    if (cart == null){
      cart = {
          items: [
            cartItem
          ]
      };
      insertToCart(cart, function(error, cartSaved){
        console.log("Insert...." + cartSaved._id);
        callback(false, cartSaved);
      })
    }
    else{
      cart.items[cart.items.length] = cartItem;

      updateToCart(cart, function(error, cartSaved){
        console.log("Update...." + cartSaved._id);
        findCartById(cartId, function(error, cart){
            callback(false, cart);
        });
      })
    }
  })
}

function findCartById(id, callback){

  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('carts');
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      var o_id = new mongodb.ObjectID(id);
      collection.find({_id: o_id}).toArray(function (err, result) {
       if (err) {
         callback(true, null);
       } else if (result.length) {
         callback(false, result[0]);
       } else {
         console.log('No document(s) found with defined "find" criteria!');
         callback(false, null)
       }
       db.close();
     });
    }
  });
}

function insertToCart(cart, callback){
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('carts');
    collection.insert(cart, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        callback(false, result.ops[0])
      }
      db.close();
    });

  });
}

function updateToCart(cart, callback){
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('carts');
    //var o_id = new mongodb.ObjectID(id);
    collection.update({_id: cart._id}, cart, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        callback(false, result)
      }
      db.close();
    });

  });
}


app.get('/cart/remove/:id', function(request, response){
  var cartId = request.cookies.cart;
  var productId =  parseInt(request.params.id);

  console.log("cart " + cartId + " removing product " +  productId);
  findCartById(cartId, function(error, cart){
    var items = [];
    for(var key in cart.items){
      var item = cart.items[key];
      if (item.id != productId){
        items[items.length] = cart.items[key];
      }
    }
    cart.items = items;
    console.log(cart);

    updateToCart(cart, function(error, result){
        response.json(cart);
    });
  });

});


var port = process.env.PORT || 3001;
app.listen(port, function() {
  console.log('Listening on 3001');
});
