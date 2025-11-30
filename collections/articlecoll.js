//
//   var articleStore = new FS.Store.S3("articleStore",{
//     region: "us-east-1", //optional in most cases
//     accessKeyId: "a0a2e143ea13c4122aae66d39cbb650151db", //required if environment variables are not set
//     secretAccessKey: "91fcee030837ff099deb07ef78d3", //required if environment variables are not set
//     bucket: "quickpharmbucket", //required
//     ACL: "private", //optional, default is 'private', but you can allow public or secure access routed through your app URL
//     folder: "folder/in/bucket", //optional, which folder (key prefix) in the bucket to use
//     // The rest are generic store options supported by all storage adapters
//     //transformWrite: myTransformWriteFunction, //optional
//     //transformRead: myTransformReadFunction, //optional
//     maxTries: 5 //optional, default 5);
//   });
//   var articlesThumbs = new FS.Store.S3("articlesThumbs",{
//     region: "us-east-1", //optional in most cases
//     accessKeyId: "a0a2e143ea13c4122aae66d39cbb650151db", //required if environment variables are not set
//     secretAccessKey: "91fcee030837ff099deb07ef78d3", //required if environment variables are not set
//     bucket: "articlethumbsbucket", //required
//     ACL: "private", //optional, default is 'private', but you can allow public or secure access routed through your app URL
//     folder: "folder/in/bucket", //optional, which folder (key prefix) in the bucket to use
//     // The rest are generic store options supported by all storage adapters
//     //transformWrite: myTransformWriteFunction, //optional
//     //transformRead: myTransformReadFunction, //optional
//     maxTries: 5 //optional, default 5);
//   });
//
//   var createThumb = function(fileObj, readStream, writeStream){
//   //transform image into  a 10*10 pixel thumbnail
//   gm(readStream, fileObj.name()).resize('10','10').stream().pipe(writeStream);
// };
var articleStore = new FS.Store.FileSystem("articles"
// ,{
    //   	path: "./uploads/articles",
	  // maxTries:5
// }
);
Articles = new FS.Collection("articles", {
	 stores: [articleStore]
  // new FS.Store.FileSystem("thumbs",{ transformWrite: createThumb})]
	// , filter: {
	//       allow: {
	//         contentTypes: ['image/jpg']
  //
	//       },
  //
	//       onInvalid: function(message) {
	//         console.log(message);
	//       }
	//     }
	});

//Articles collection permission
// var articleStore = new FS.Store.S3("images", {
//     accessKeyId: "xxxx",
//     secretAccessKey: "xxxx",
//     bucket: "www.mybucket.com"
// });


//if(Meteor.isServer){
Articles.allow({

	insert : function(userId,doc){
	return true;
	},
	update : function(userId,doc,fieldNames,modifier){
	return true;
	},
	remove : function(userId,doc){
	return true;
	},
	download: function(){
	return true;
	},
	  fetch: ['Owner']

});
//}
