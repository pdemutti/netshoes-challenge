var App = App || {};


App.Challenge = {
    setup: function() {
        App.Challenge.getData("/products");
    },
    getData: function(url){
      axios.get(url).then(function(res) {
        App.Challenge.buildProductList(res);
      });
    },
    buildProductList: function(res) {
        var html = "<ul class='product-list'>";
          for (var key in res.data.products){
            var fullItem = res.data.products[key];
            var idItem = fullItem.id;
            var currencyFormat = fullItem.currencyFormat;
            var price = fullItem.price;
            var installments = fullItem.installments;
            var priceBig = fullItem.price.toString().split(".")[0];
            var priceDecimal = fullItem.price.toString().split(".")[1];
            var title = fullItem.title;
            var availableSizes = fullItem.availableSizes;

            html += "<li id='"+idItem+"'>";
              html += "<figure><img src='http://static5.netshoes.net/Produtos/camisa-adidas-palmeiras-iii-1314-sn--centenario/46/132-2072-046/132-2072-046_zoom1.jpg?resize=544:*' alt='' /></figure>";
              html += "<span class='item-title'>" + title + "</span><hr>";
              html +=  "<span class='item-price'>"+currencyFormat+"<b>"+priceBig+"</b>."+priceDecimal+"</span>"
              html +=  "<span class='item-installment'>ou "+installments+"x de R$25,00</span>"
            html +=  "</li>";
          }
        html +=  "</ul>";
        $('.store').append(html);
    }
};

App.Challenge.setup();
