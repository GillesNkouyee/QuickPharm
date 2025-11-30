// var FS = Npm.require('fs');
//
// var articleStore = new FS.Store.S3("articleStore", {
//   accessKeyId: "a0a2e143ea13c4122aae66d39cbb650151db",
//   secretAccessKey: "91fcee030837ff099deb07ef78d3",
//   bucket: "quickpharmbucket",
//   transformWrite: function(fileObj, readStream, writeStream) {
//     gm(readStream, fileObj.name()).resize('250', '250').stream().pipe(writeStream)
//   }
// })
//
// var articlesThumbs = new FS.Store.S3("articlesThumbs", {
//   accessKeyId: "a0a2e143ea13c4122aae66d39cbb650151db",
//   secretAccessKey: "91fcee030837ff099deb07ef78d3",
//   bucket: "articlethumbsbucket",
//   beforeWrite: function(fileObj) {
//     fileObj.size(20, {store: "articlesThumbs", save: false});
//   },
//   transformWrite: function(fileObj, readStream, writeStream) {
//     gm(readStream, fileObj.name()).resize('20', '20').stream().pipe(writeStream)
//   }
// })
//
//
// Articles = new FS.Collection("articles", {
//   stores: [articleStore, articlesThumbs],
//   filter: {
//     allow: {
//       contentTypes: ['image/*']
//     }
//   }
// })
