Template.cart.helpers({
    cartitems:function(){
        return Cart.find();
    },
    subtotal:function(price,qty){
          var total = 0;
          var cart = Cart.find().fetch();
          for(var i=0; i < cart.length;i++ ){
              var pdata = Productdata.findOne({_id:cart[i].pdata});
              total += pdata.price * cart[i].qty;
          }
          Session.set('cartTotal',total);
          return total;
    }
});
Template.cart.events({
    'click .checkOutBtn':function(){
        Session.set('isCheckingOut',true);
    },
    'mouseup #delFromCart':function(evt,tmpl){
        console.log(this._id);
        deletefromcart(this._id);
    }
});
function deletefromcart(id){
    Meteor.call('Cart.remove',id);
}
