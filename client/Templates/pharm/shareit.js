ShareIt.configure({
   sites: {                // nested object for extra configurations
       'facebook': {
           appId: '1438965492786310',
           xfbml      : true,
           version    : 'v2.7'// use sharer.php when it's null, otherwise use share dialog
       },

        'twitter': {},
       //'googleplus': {},
       //'pinterest': {}
   },

   classes: " btn btn-xs", // string (default: 'large btn')
                         // The classes that will be placed on the sharing buttons, bootstrap by default.
   iconOnly: true,      // boolean (default: false)
                         // Don't put text on the sharing buttons
   applyColors: true,     // boolean (default: true)
                         // apply classes to inherit each social networks background color
   faSize: '',            // font awesome size
   faClass: ''		  // font awesome classes like square
 });
 (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
 // <script>
 //   window.fbAsyncInit = function() {
 //     FB.init({
 //       appId      : '1438965492786310',
 //       xfbml      : true,
 //       version    : 'v2.7'
 //     });
 //   };
 //
 //   (function(d, s, id){
 //      var js, fjs = d.getElementsByTagName(s)[0];
 //      if (d.getElementById(id)) {return;}
 //      js = d.createElement(s); js.id = id;
 //      js.src = "//connect.facebook.net/en_US/sdk.js";
 //      fjs.parentNode.insertBefore(js, fjs);
 //    }(document, 'script', 'facebook-jssdk'));
 // </script>
