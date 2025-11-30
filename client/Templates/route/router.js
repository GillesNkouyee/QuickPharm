Router.configure({
    layoutTemplate: 'Applayout',
    notFoundTemplate: 'notFound', //template with name notFound
    loadingTemplate: 'Loading',//template with name loading
});

Router.map(function(){

    this.route('Home',{path: '/'}),
    this.route('home',{path: '/home'}),
    this.route('voiceRecognition',{path: '/myvocalAssistant'}),
    this.route('login',{path: 'login'}),
    this.route('mystoryview',{path: '/mystory',onBeforeAction:function(pause){
      if (! Meteor.user()) {
          if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else{
      this.render('login');
      }

          }else {
          this.next();
      }
    }
  }),
    this.route('shoplist',{path: '/shoplist',
        waitOn: function() { return Meteor.subscribe("shoplist");
        }
    }),
    this.route('/Shop/:_id', function () {
      var item = Shop.findOne({_id: this.params._id});
      this.render('shopinfo', {data: item});
        }, {
      name: 'shopinfo'
    }),
    this.route('updateshop',{path: '/updateshop'}),
    this.route('register',{path: '/register'}),
    this.route('search',{path: '/searchmedocs'}),
    this.route('searchMedicaments',{path: '/searchMedicaments'}),
    this.route('findAidesoignant',{path: '/findaidesoignant'}),
    this.route('newaidesoignant',{path: '/new.praticiens',onBeforeAction:function(pause){
      if (! Meteor.user()) {
          if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else{
      this.render('login');
      }
        }else {
        this.next();
       }
      }
    }),
    this.route('formulaireEtablissement',{path: '/new.etablissements',onBeforeAction:function(pause){
      if (! Meteor.user()) {
          if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else{
      this.render('login');
      }
        }else {
        this.next();
       }
      }
    }),
    /* this.route('newaidesoignant',{path: '/new.praticiens'}),
    this.route('formulaireEtablissement',{path: '/new.etablissements'}), */
    this.route('searchEtablissements',{path: '/searchEtablissement'}),
    this.route('articlestore',{path: '/articlestore',
    waitOn: function() { return Meteor.subscribe("articlestore");
    }
  }),
    this.route('/Productdata/:_id', function () {
      var item = Productdata.findOne({_id: this.params._id});
      this.render('compare', {data: item});
        }, {
      name: 'compare'
    })
    this.route('searchresults',{path:'/searchresults'}),

    Router.route('/updateshop/:_id', function() {
        var item = Shop.findOne({_id:Router.current().params._id});
        this.render('EditShop', {data: item});
        }, {
      name: 'EditShop'
    })
//     Router.route('/:artsLimit?', {
//   name: 'articlestore',
//   waitOn: function() {
//     var limit = parseInt(this.params.artsLimit) || 5;
//     return Meteor.subscribe('articlestore', {sort: {createdAt: -1}, limit: limit});
//   },
//   data: function() {
//     var limit = parseInt(this.params.postsLimit) || 5;
//     return {
//       articlestore: Articles.find({}, {sort: {createdAt: -1}, limit: limit})
//     };
//   }
// });

    // Router.route('/yourshop/:_id', function() {
    //     var item = Shop.findOne({_id:Router.current().params._id});
    //     this.render('manageShop', {data: item});
    //     }, {
    //   name: 'manageShop'
    // }),
    this.route('Addshop',{path:'/Addshop',
       onBeforeAction:function(pause){
    if (! Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else{
        this.render('accessDenied');
        }

            }else {
            this.next();
        }
      }
    }),
    this.route('Profile',{path:'/admin/userCp',
            onBeforeAction:function(pause){
            if (Roles.userIsInRole(Meteor.user(), ['admin','manager','basic'])) {
              this.render('userProfile');
                 }
                else {
                //adminfalse
                  this.render('Home');
            }
        }

     }),
   this.route('userCtrlpanel',{path: 'Admin/controlpanel/userCtrlpanel',
               onBeforeAction:function(pause){
                if (! Meteor.user()) {
                    if (Meteor.loggingIn()) {
                    this.render(this.loadingTemplate);
                } else{
                this.render('Home');
                }

                    }else {
                    this.next();
                }
              }
   })/*
    this.route('shopinfo',{path: '/Shop/:_id',
        waitOn: function() { return Meteor.subscribe("shopinfo");
        }
    })*/
   /* Route servies par l'AV */
   this.route('pharmaciesPage',{path: '/pages/pharmacies'}),
   this.route('formationsPage',{path: '/pages/formations'}),
   this.route('personnelsPage',{path: '/pages/personnels'})
});
