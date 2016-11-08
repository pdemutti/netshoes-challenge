var App = App || {};


App.Challenge = {
    setup: function() {
        App.Challenge.getData("/allproducts");
        App.Challenge.getCartList();
        App.Challenge.bindItem();
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

            html += "<li data-id='"+idItem+"'>";
              html += "<figure><img src='images/"+imagePath+"' alt='' /></figure>";
              html += "<span class='item-title'>" + title + "</span><hr>";
              html +=  "<span class='item-price'>"+currencyFormat+"<b>"+priceBig+"</b>."+priceDecimal+"</span>"
              html +=  "<span class='item-installment'>ou "+installments+"x de R$25,00</span>"
            html +=  "</li>";
          }
        html +=  "</ul>";
        $('.store').append(html);
        App.Challenge.bindItem();
    },
    bindItem: function(){
      $('.product-list li').click(function(event){
         var id = this.getAttribute("data-id");
          // console.log(this.getAttribute("data-id"))
          App.Challenge.addItemToCart(id);

      });
    },
    addItemToCart: function(id){
      axios.get("/cart/add/"+id).then(function(res) {

        App.Challenge.buildCartItemMrkp(res);
      });
    },
    getCartList: function(){
      axios.get("/cart/").then(function(res) {
        App.Challenge.buildCartItemMrkp(res);
      });
    },
    buildCartItemMrkp: function(res){
      var cartList = document.getElementById("cart-list");
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

        $('.cart-list ul').append(html);
      }
    },
    removeCartItem: function(id){
      axios.get("/cart/remove/" + id).then(function(res) {
       App.Challenge.buildCartItemMrkp(res);
     });
      // document.getElementsByClassName("remove-bt").getAttribute("data-id");
      // myElement.parentNode.removeChild(myElement)
    }
};

App.Challenge.setup();
