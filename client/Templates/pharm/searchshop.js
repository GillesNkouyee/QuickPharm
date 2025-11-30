
Template.searchshop.events ({
	"keyup input, change input[type='radio']": _.throttle(function(e) {
var shopstyle = $("[name='shopstyle']").val().trim(),
		shopadress = $("[name='shopadress']").val().trim(),
		garde = $("[name='garde']").val().trim(),
		garde = $("input[name='garde']:checked").val();
		search = {};
		if(shopstyle) search.shopstyle = {$regex: new RegExp(shopstyle),
		$options: "i"};
		if(shopadress) search.shopadress = {$regex: new RegExp(shopadress),
		$options: "i"};
		if(garde) search.garde = {$regex: new RegExp(garde),
		$options: "i"};

		maliste.set(Shop.find(search));
	},200),
	
});
Template.searchshop.onRendered(function () {
  this.$('.ui.radio.checkbox').checkbox();
});