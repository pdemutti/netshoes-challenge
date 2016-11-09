var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/challenge';


exports.createCartItem = function(product){
  var cartItem = {
    "id":  product.id,
    "title":  product.title,
    "image":  product.image,
    "availableSizes":  product.availableSizes,
    "quantity" : 1,
    "price": product.price
  }
  return cartItem;
};
exports.insertToCart = function(cart, callback){
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
exports.addToCart = function (cartId, product, callback){
  exports.findCartById(cartId, function(error, cart){

    if (cart == null){
      cartItem = exports.createCartItem(product);
      cart = {
          items: [
            cartItem
          ]
      };
      exports.insertToCart(cart, function(error, cartSaved){
        console.log("Insert...." + cartSaved._id);
        callback(false, cartSaved);
      });
    }
    else{
      var cartItem = exports.findCartItemById(cart, product.id);
      if (cartItem == null){
        cartItem = exports.createCartItem(product);
        cart.items[cart.items.length] = cartItem;
      }
      else{
        cartItem.quantity++;
      }

      exports.updateToCart(cart, function(error, cartSaved){
        // console.log("Update...." + cartSaved._id);
        exports.findCartById(cartId, function(error, cart){
            callback(false, cart);
        });
      })
    }
  })
}

exports.findCartById = function (id, callback){

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

exports.findCartItemById = function (cart, productId){
  for(var key in cart.items){
    var item = cart.items[key];
    if (item.id == productId){
      return item;
    }
  }
  return null;
}

exports.updateToCart = function(cart, callback){
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
