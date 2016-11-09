var App = App || {};


App.Challenge = {
    setup: function() {
        App.Challenge.getData("/allproducts");
        App.Challenge.getCartList();
        App.Challenge.bindItem();
        App.Challenge.bindLockIcon();
        App.Challenge.hiddenCart();

    },
    getData: function(url){
      axios.get(url).then(function(res) {
        App.Challenge.buildProductList(res);
      });
    },
    buildProductList: function(res) {
        var html = "<ul class='product-list'>";
          for (var key in res.data){
            var fullItem = res.data[key];
            var idItem = fullItem.id;
            var currencyFormat = fullItem.currencyFormat;
            var price = fullItem.price;
            var imagePath = fullItem.image;
            var installments = fullItem.installments;
            var priceBig = fullItem.price.toString().split(".")[0];
            var priceDecimal = fullItem.price.toString().split(".")[1];
            var title = fullItem.title;
            var availableSizes = fullItem.availableSizes;

            html += "<li class='item' data-id='"+idItem+"'>";
              html += "<figure><img src='images/"+imagePath+"' alt='' /></figure>";
              html += "<span class='item-title'>" + title + "</span>";
              html += "<span class='wrap-hr'><hr></span>";
              html +=  "<span class='item-price'>"+currencyFormat+"<b>"+priceBig+"</b>."+priceDecimal+"</span>"
              html +=  "<span class='item-installment'>ou "+installments+"x de R$25,00</span>"
            html +=  "</li>";
          }
        html +=  "</ul>";
        $('.store').append(html);
        App.Challenge.bindItem();
    },
    bindLockIcon: function(){
      var hasItemsOut = document.getElementsByClassName("has-items");
      var hasItemsInside = document.getElementsByClassName("header-cart");

      $('.has-items').find(".badge").remove();

      axios.get("/cart/").then(function(res) {
        var quantityVal = [];
        var data = res.data.items;
        for (var prop in data) {
          quantityVal.push(data[prop].quantity);
        }
        var sum = quantityVal.reduce(function(a, b) {
          return a + b;
        }, 0);

        var html = "<span class='badge'>"+sum+"</span>";
        if(sum > 0){
          $(hasItemsOut).append(html);
          $(hasItemsInside).append(html);
          $('body').find(".has-items").click(function(){
            App.Challenge.showCart();
          });
        }
      });
    },
    bindItem: function(){
      $('.product-list li').click(function(event){
         var id = this.getAttribute("data-id");
          // console.log(this.getAttribute("data-id"))
          App.Challenge.addItemToCart(id);
          App.Challenge.showCart();
      });
    },
    showCart: function(){
      var cart = $('#cart-list');
      cart.animate({"right":"10px"}, "fast").addClass('visible');
    },
    hiddenCart: function(){
      var cart = $('#cart-list');
      $('.toogle-cart').click(function(){
        cart.animate({"right":"-700"}, "fast").removeClass('visible');
      })
    },
    addItemToCart: function(id){
      axios.get("/cart/add/"+id).then(function(res) {
        App.Challenge.buildCartItemMrkp(res);
        App.Challenge.bindLockIcon();
      });
    },
    getCartList: function(){
      axios.get("/cart/").then(function(res) {
        App.Challenge.buildCartItemMrkp(res);
        // App.Challenge.bindLockIcon(res);
      });
    },
    buildCartItemMrkp: function(res){
      var cartList = document.getElementById("cart");
      cartList.innerHTML = '';

      var items = res.data.items;
      for (var key in items){
        var singleItem = items[key],
            id = singleItem.id,
            title = singleItem.title,
            thumb = singleItem.image,
            qtd = singleItem.quantity,
            size =  singleItem.availableSizes.toString();

        console.log(singleItem);
        var html = "<li>";
          html += "<figure class='thumb'><img src='images/"+thumb+"' /></figure>";
            html += "<div class='details'>";
              html += "<span class='cart-item-title'>"+title+"</span>";
                html += "<span class='cart-item-size'>"+size+"</span>";
                  html += "<span class='cart-item-qtd'>Quantidade: "+qtd+"</span>";
                  html += "<div class='action-area'>";
                html += "<span class='remove-bt' onclick='App.Challenge.removeCartItem("+id+")'>X</span>";
              html += "</div>";
            html += "<span class='cart-item-price'>R$49,90</span>";
          html += "</div>"
        html += "</li>";

        $('#cart-list ul').append(html);
      }
    },
    removeCartItem: function(id){
      axios.get("/cart/remove/" + id).then(function(res) {
       App.Challenge.buildCartItemMrkp(res);
     });
    }
};

App.Challenge.setup();
