//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var Template = Package['templating-runtime'].Template;
var AutoForm = Package['aldeed:autoform'].AutoForm;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Hooks, Util, i, CfsAutoForm;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/cfs_autoform/packages/cfs_autoform.js                                                              //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/cfs:autoform/template.cfs-autoform.js                                                       //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
                                                                                                        // 1
Template.__checkName("cfsFileField_bootstrap3");                                                        // 2
Template["cfsFileField_bootstrap3"] = new Template("Template.cfsFileField_bootstrap3", (function() {    // 3
  var view = this;                                                                                      // 4
  return [ HTML.INPUT(HTML.Attrs({                                                                      // 5
    type: "file",                                                                                       // 6
    "class": "cfsaf-hidden",                                                                            // 7
    "data-cfs-collection": function() {                                                                 // 8
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "atts", "collection"));                 // 9
    }                                                                                                   // 10
  }, function() {                                                                                       // 11
    return Spacebars.attrMustache(view.lookup("fileInputAtts"));                                        // 12
  })), "\n  ", HTML.INPUT(HTML.Attrs({                                                                  // 13
    type: "text",                                                                                       // 14
    readonly: ""                                                                                        // 15
  }, function() {                                                                                       // 16
    return Spacebars.attrMustache(view.lookup("textInputAtts"));                                        // 17
  })) ];                                                                                                // 18
}));                                                                                                    // 19
                                                                                                        // 20
Template.__checkName("cfsFilesField_bootstrap3");                                                       // 21
Template["cfsFilesField_bootstrap3"] = new Template("Template.cfsFilesField_bootstrap3", (function() {  // 22
  var view = this;                                                                                      // 23
  return [ HTML.INPUT(HTML.Attrs({                                                                      // 24
    type: "file",                                                                                       // 25
    "class": "cfsaf-hidden",                                                                            // 26
    multiple: "",                                                                                       // 27
    "data-cfs-collection": function() {                                                                 // 28
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "atts", "collection"));                 // 29
    }                                                                                                   // 30
  }, function() {                                                                                       // 31
    return Spacebars.attrMustache(view.lookup("fileInputAtts"));                                        // 32
  })), "\n  ", HTML.INPUT(HTML.Attrs({                                                                  // 33
    type: "text",                                                                                       // 34
    readonly: ""                                                                                        // 35
  }, function() {                                                                                       // 36
    return Spacebars.attrMustache(view.lookup("textInputAtts"));                                        // 37
  })) ];                                                                                                // 38
}));                                                                                                    // 39
                                                                                                        // 40
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/cfs:autoform/cfs-autoform-hooks.js                                                          //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
Hooks = {                                                                                               // 1
  beforeInsert: function (doc) {                                                                        // 2
    var self = this, template = this.template;                                                          // 3
    if (!AutoForm.validateForm(this.formId)) {                                                          // 4
      return false;                                                                                     // 5
    }                                                                                                   // 6
                                                                                                        // 7
    // Loop through all hidden file inputs in the form.                                                 // 8
    var totalFiles = 0;                                                                                 // 9
    var arrayFields = {};                                                                               // 10
    template.$('.cfsaf-hidden').each(function () {                                                      // 11
      var elem = $(this);                                                                               // 12
                                                                                                        // 13
      // Get schema key that this input is for                                                          // 14
      var key = elem.attr("data-schema-key");                                                           // 15
                                                                                                        // 16
      // no matter what, we want to delete the dummyId value                                            // 17
      //delete doc[key];                                                                                // 18
      CfsAutoForm.Util.deepDelete(doc,key);                                                             // 19
                                                                                                        // 20
      // Get list of files that were attached for this key                                              // 21
      var fileList = elem.data("cfsaf_files");                                                          // 22
                                                                                                        // 23
      // If we have some attached files                                                                 // 24
      if (fileList) {                                                                                   // 25
        // add all files to total count                                                                 // 26
        totalFiles += fileList.length;                                                                  // 27
      }                                                                                                 // 28
                                                                                                        // 29
      // Otherwise it might be a multiple files field                                                   // 30
      else {                                                                                            // 31
        var fileListList = elem.data("cfsaf_files_multi");                                              // 32
        if (fileListList) {                                                                             // 33
          // make a note that it's an array field                                                       // 34
          arrayFields[key] = true;                                                                      // 35
          // add all files to total count                                                               // 36
          _.each(fileListList, function (fileList) {                                                    // 37
            totalFiles += fileList.length;                                                              // 38
          });                                                                                           // 39
          // prep the array                                                                             // 40
          doc[key] = [];                                                                                // 41
        }                                                                                               // 42
      }                                                                                                 // 43
    });                                                                                                 // 44
                                                                                                        // 45
    // If no files were attached anywhere on the form, we're done.                                      // 46
    // We pass back the doc synchronously                                                               // 47
    if (totalFiles === 0) {                                                                             // 48
      return doc;                                                                                       // 49
    }                                                                                                   // 50
                                                                                                        // 51
    // Create the callback that will be called either                                                   // 52
    // upon file insert error or upon each file being uploaded.                                         // 53
    var doneFiles = 0;                                                                                  // 54
    var failedFiles = 0;                                                                                // 55
    function cb(error, fileObj, key) {                                                                  // 56
      // Increment the done files count                                                                 // 57
      doneFiles++;                                                                                      // 58
                                                                                                        // 59
      // Increment the failed files count if it failed                                                  // 60
      if (error) {                                                                                      // 61
        failedFiles++;                                                                                  // 62
      }                                                                                                 // 63
                                                                                                        // 64
      // If it didn't fail, set the new ID as the property value in the doc,                            // 65
      // or push it into the array of IDs if it's a multiple files field.                               // 66
      else {                                                                                            // 67
        if (arrayFields[key]) {                                                                         // 68
          CfsAutoForm.Util.deepFind(doc,key)[key].push(fileObj._id);                                    // 69
        } else {                                                                                        // 70
          //doc[key] = fileObj._id;                                                                     // 71
          CfsAutoForm.Util.deepSet(doc,key,fileObj._id);                                                // 72
        }                                                                                               // 73
      }                                                                                                 // 74
                                                                                                        // 75
      // If this is the last file to be processed, pass execution back to autoform                      // 76
      if (doneFiles === totalFiles) {                                                                   // 77
        // If any files failed                                                                          // 78
        if (failedFiles > 0) {                                                                          // 79
          // delete all that succeeded                                                                  // 80
          CfsAutoForm.deleteUploadedFiles(template);                                                    // 81
          // pass back to autoform code, telling it we failed                                           // 82
          self.result(false);                                                                           // 83
        }                                                                                               // 84
        // Otherwise if all files succeeded                                                             // 85
        else {                                                                                          // 86
          // pass updated doc back to autoform code, telling it we succeeded                            // 87
          self.result(doc);                                                                             // 88
        }                                                                                               // 89
      }                                                                                                 // 90
    }                                                                                                   // 91
                                                                                                        // 92
    // Loop through all hidden file fields, inserting                                                   // 93
    // and uploading all files that have been attached to them.                                         // 94
    template.$('.cfsaf-hidden').each(function () {                                                      // 95
      var elem = $(this);                                                                               // 96
                                                                                                        // 97
      // Get schema key that this input is for                                                          // 98
      var key = elem.attr("data-schema-key");                                                           // 99
                                                                                                        // 100
      // Get the FS.Collection instance                                                                 // 101
      var fsCollectionName = elem.attr("data-cfs-collection");                                          // 102
      var fsCollection = FS._collections[fsCollectionName];                                             // 103
                                                                                                        // 104
      // Loop through all files that were attached to this field                                        // 105
      function loopFileList(fileList) {                                                                 // 106
        _.each(fileList, function (file) {                                                              // 107
          // Create the FS.File instance                                                                // 108
          var fileObj = new FS.File(file);                                                              // 109
                                                                                                        // 110
          // Listen for the "uploaded" event on this file, so that we                                   // 111
          // can call our callback. We want to wait until uploaded rather                               // 112
          // than just inserted. XXX Maybe should wait for stored?                                      // 113
          fileObj.once("uploaded", function () {                                                        // 114
            // track successful uploads so we can delete them if any                                    // 115
            // of the other files fail to upload                                                        // 116
            var uploadedFiles = elem.data("cfsaf_uploaded-files") || [];                                // 117
            uploadedFiles.push(fileObj);                                                                // 118
            elem.data("cfsaf_uploaded-files", uploadedFiles);                                           // 119
            // call callback                                                                            // 120
            cb(null, fileObj, key);                                                                     // 121
          });                                                                                           // 122
                                                                                                        // 123
          // Insert the FS.File instance into the FS.Collection                                         // 124
          fsCollection.insert(fileObj, function (error, fileObj) {                                      // 125
            // call callback if insert/upload failed                                                    // 126
            if (error) {                                                                                // 127
              cb(error, fileObj, key);                                                                  // 128
            }                                                                                           // 129
            // TODO progress bar during uploads                                                         // 130
          });                                                                                           // 131
        });                                                                                             // 132
      }                                                                                                 // 133
                                                                                                        // 134
      // single fields first                                                                            // 135
      loopFileList(elem.data("cfsaf_files"));                                                           // 136
      // then multiple fields                                                                           // 137
      _.each(elem.data("cfsaf_files_multi"), function (fileList) {                                      // 138
        loopFileList(fileList);                                                                         // 139
      });                                                                                               // 140
    });                                                                                                 // 141
  },                                                                                                    // 142
  afterInsert: function (error) {                                                                       // 143
    var template = this.template, elems = template.$('.cfsaf-hidden');                                  // 144
    if (error) {                                                                                        // 145
      CfsAutoForm.deleteUploadedFiles(template);                                                        // 146
      if (FS.debug || AutoForm._debug)                                                                  // 147
        console.log("There was an error inserting so all uploaded files were removed.", error);         // 148
    } else {                                                                                            // 149
      // cleanup files data                                                                             // 150
      elems.removeData("cfsaf_files");                                                                  // 151
      elems.removeData("cfsaf_files_multi");                                                            // 152
    }                                                                                                   // 153
    // cleanup uploaded files data                                                                      // 154
    elems.removeData("cfsaf_uploaded-files");                                                           // 155
  },                                                                                                    // 156
  beforeUpdate: function(doc){                                                                          // 157
    var self = this, template = this.template;                                                          // 158
    if (!AutoForm.validateForm(this.formId)) {                                                          // 159
      return false;                                                                                     // 160
    }                                                                                                   // 161
    // Loop through all hidden file inputs in the form.                                                 // 162
    var totalFiles = 0;                                                                                 // 163
    var arrayFields = {};                                                                               // 164
    template.$('.cfsaf-hidden').each(function () {                                                      // 165
      var elem = $(this);                                                                               // 166
                                                                                                        // 167
      // Get schema key that this input is for                                                          // 168
      var key = elem.attr("data-schema-key");                                                           // 169
                                                                                                        // 170
      //Maintain current key                                                                            // 171
      doc.$set[key] = self.currentDoc[key];                                                             // 172
                                                                                                        // 173
      // Get list of files that were attached for this key                                              // 174
      var fileList = elem.data("cfsaf_files");                                                          // 175
                                                                                                        // 176
      // If we have some attached files                                                                 // 177
      if (fileList) {                                                                                   // 178
        // add all files to total count                                                                 // 179
        totalFiles += fileList.length;                                                                  // 180
        //we delete the id only if we uploaded another file                                             // 181
        //delete doc[key];                                                                              // 182
        CfsAutoForm.Util.deepDelete(doc,key);                                                           // 183
      }                                                                                                 // 184
                                                                                                        // 185
      // Otherwise it might be a multiple files field                                                   // 186
      else {                                                                                            // 187
        var fileListList = elem.data("cfsaf_files_multi");                                              // 188
        if (fileListList) {                                                                             // 189
          //we delete the id only if we uploaded another file                                           // 190
          //delete doc[key];                                                                            // 191
          CfsAutoForm.Util.deepDelete(doc,key);                                                         // 192
          // make a note that it's an array field                                                       // 193
          arrayFields[key] = true;                                                                      // 194
          // add all files to total count                                                               // 195
          _.each(fileListList, function (fileList) {                                                    // 196
            totalFiles += fileList.length;                                                              // 197
          });                                                                                           // 198
          // prep the array                                                                             // 199
          doc[key] = [];                                                                                // 200
        }                                                                                               // 201
      }                                                                                                 // 202
    });                                                                                                 // 203
                                                                                                        // 204
    // If no files were attached anywhere on the form, we're done.                                      // 205
    // We pass back the doc synchronously                                                               // 206
    if (totalFiles === 0) {                                                                             // 207
      return doc;                                                                                       // 208
    }                                                                                                   // 209
                                                                                                        // 210
    // Create the callback that will be called either                                                   // 211
    // upon file insert error or upon each file being uploaded.                                         // 212
    var doneFiles = 0;                                                                                  // 213
    var failedFiles = 0;                                                                                // 214
    function cb(error, fileObj, key) {                                                                  // 215
      // Increment the done files count                                                                 // 216
      doneFiles++;                                                                                      // 217
                                                                                                        // 218
      // Increment the failed files count if it failed                                                  // 219
      if (error) {                                                                                      // 220
        failedFiles++;                                                                                  // 221
      }                                                                                                 // 222
                                                                                                        // 223
      // If it didn't fail, set the new ID as the property value in the doc,                            // 224
      // or push it into the array of IDs if it's a multiple files field.                               // 225
      else {                                                                                            // 226
        if (arrayFields[key]) {                                                                         // 227
          CfsAutoForm.Util.deepFind(doc.$set,key).push(fileObj._id);                                    // 228
        } else {                                                                                        // 229
          //doc[key] = fileObj._id;                                                                     // 230
          CfsAutoForm.Util.deepSet(doc.$set,key,fileObj._id);                                           // 231
        }                                                                                               // 232
      }                                                                                                 // 233
                                                                                                        // 234
      // If this is the last file to be processed, pass execution back to autoform                      // 235
      if (doneFiles === totalFiles) {                                                                   // 236
        // If any files failed                                                                          // 237
        if (failedFiles > 0) {                                                                          // 238
          // delete all that succeeded                                                                  // 239
          CfsAutoForm.deleteUploadedFiles(template);                                                    // 240
          // pass back to autoform code, telling it we failed                                           // 241
          self.result(false);                                                                           // 242
        }                                                                                               // 243
        // Otherwise if all files succeeded                                                             // 244
        else {                                                                                          // 245
          // pass updated doc back to autoform code, telling it we succeeded                            // 246
          console.log(doc);                                                                             // 247
          self.result(doc);                                                                             // 248
        }                                                                                               // 249
      }                                                                                                 // 250
    }                                                                                                   // 251
                                                                                                        // 252
    // Loop through all hidden file fields, inserting                                                   // 253
    // and uploading all files that have been attached to them.                                         // 254
    template.$('.cfsaf-hidden').each(function () {                                                      // 255
      var elem = $(this);                                                                               // 256
                                                                                                        // 257
      // Get schema key that this input is for                                                          // 258
      var key = elem.attr("data-schema-key");                                                           // 259
                                                                                                        // 260
      // Get the FS.Collection instance                                                                 // 261
      var fsCollectionName = elem.attr("data-cfs-collection");                                          // 262
      var fsCollection = FS._collections[fsCollectionName];                                             // 263
                                                                                                        // 264
      // Loop through all files that were attached to this field                                        // 265
      function loopFileList(fileList) {                                                                 // 266
        _.each(fileList, function (file) {                                                              // 267
          // Create the FS.File instance                                                                // 268
          var fileObj = new FS.File(file);                                                              // 269
                                                                                                        // 270
          // Listen for the "uploaded" event on this file, so that we                                   // 271
          // can call our callback. We want to wait until uploaded rather                               // 272
          // than just inserted. XXX Maybe should wait for stored?                                      // 273
          fileObj.once("uploaded", function () {                                                        // 274
            // track successful uploads so we can delete them if any                                    // 275
            // of the other files fail to upload                                                        // 276
            var uploadedFiles = elem.data("cfsaf_uploaded-files") || [];                                // 277
            uploadedFiles.push(fileObj);                                                                // 278
            elem.data("cfsaf_uploaded-files", uploadedFiles);                                           // 279
            // call callback                                                                            // 280
            cb(null, fileObj, key);                                                                     // 281
          });                                                                                           // 282
                                                                                                        // 283
          // Insert the FS.File instance into the FS.Collection                                         // 284
          fsCollection.insert(fileObj, function (error, fileObj) {                                      // 285
            // call callback if insert/upload failed                                                    // 286
            if (error) {                                                                                // 287
              cb(error, fileObj, key);                                                                  // 288
            }                                                                                           // 289
            // TODO progress bar during uploads                                                         // 290
          });                                                                                           // 291
        });                                                                                             // 292
      }                                                                                                 // 293
                                                                                                        // 294
      // single fields first                                                                            // 295
      loopFileList(elem.data("cfsaf_files"));                                                           // 296
      // then multiple fields                                                                           // 297
      _.each(elem.data("cfsaf_files_multi"), function (fileList) {                                      // 298
        loopFileList(fileList);                                                                         // 299
      });                                                                                               // 300
    });                                                                                                 // 301
  },                                                                                                    // 302
  afterUpdate: function(error, result){                                                                 // 303
    var template = this.template;                                                                       // 304
    var elems = template.$('.cfsaf-hidden');                                                            // 305
    if (error) {                                                                                        // 306
      CfsAutoForm.deleteUploadedFiles(template);                                                        // 307
      if (FS.debug || AutoForm._debug)                                                                  // 308
        console.log("There was an error inserting so all uploaded files were removed.", error);         // 309
    } else {                                                                                            // 310
      // cleanup files data                                                                             // 311
      elems.removeData("cfsaf_files");                                                                  // 312
      elems.removeData("cfsaf_files_multi");                                                            // 313
    }                                                                                                   // 314
    // cleanup uploaded files data                                                                      // 315
    elems.removeData("cfsaf_uploaded-files");                                                           // 316
  }                                                                                                     // 317
};                                                                                                      // 318
                                                                                                        // 319
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/cfs:autoform/cfs-autoform-util.js                                                           //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
Util = {                                                                                                // 1
  //delete prop from obj                                                                                // 2
  //prop can be something like "obj.3.badprop                                                           // 3
  deepDelete: function(obj, prop){                                                                      // 4
    return CfsAutoForm.Util.deepDo(obj, prop, function(obj, prop){                                      // 5
      delete obj[prop];                                                                                 // 6
    });                                                                                                 // 7
  },                                                                                                    // 8
  deepSet: function(obj, prop, value){                                                                  // 9
    return CfsAutoForm.Util.deepDo(obj, prop, function(obj, prop){                                      // 10
      obj[prop] = value;                                                                                // 11
    });                                                                                                 // 12
  },                                                                                                    // 13
  //returns the object that CONTAINS the last property                                                  // 14
  deepFind: function(obj, path){                                                                        // 15
    path = path.split('.');                                                                             // 16
    for (i = 0; i < path.length - 1; i++)                                                               // 17
      obj = obj[path[i]];                                                                               // 18
                                                                                                        // 19
    return obj;                                                                                         // 20
  },                                                                                                    // 21
  //executes closure(obj, prop) where prop might be a string of properties and array indices            // 22
  deepDo: function(obj, path, closure){                                                                 // 23
    path = path.split('.');                                                                             // 24
    for (i = 0; i < path.length - 1; i++)                                                               // 25
      obj = obj[path[i]];                                                                               // 26
                                                                                                        // 27
    closure.apply(this, [obj, path[i]]);                                                                // 28
  }                                                                                                     // 29
};                                                                                                      // 30
                                                                                                        // 31
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/cfs:autoform/cfs-autoform.js                                                                //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
CfsAutoForm = CfsAutoForm || {};                                                                        // 1
CfsAutoForm.Util = Util;                                                                                // 2
CfsAutoForm.Hooks = Hooks;                                                                              // 3
                                                                                                        // 4
CfsAutoForm.deleteUploadedFiles = function(template) {                                                  // 5
  template.$('.cfsaf-hidden').each(function () {                                                        // 6
    var uploadedFiles = $(this).data("cfsaf_uploaded-files") || [];                                     // 7
    _.each(uploadedFiles, function ( f ) {                                                              // 8
      f.remove();                                                                                       // 9
    });                                                                                                 // 10
  });                                                                                                   // 11
};                                                                                                      // 12
                                                                                                        // 13
                                                                                                        // 14
if (Meteor.isClient) {                                                                                  // 15
    // Adds a custom "cfs-file" input type that AutoForm will recognize                                 // 16
  AutoForm.addInputType("cfs-file", {                                                                   // 17
    template:"cfsFileField",                                                                            // 18
    valueOut: function () {                                                                             // 19
      return "dummyId";                                                                                 // 20
    },                                                                                                  // 21
    contextAdjust: function (context) {                                                                 // 22
      context.atts.placeholder = context.atts.placeholder || "Click to upload a file or drop it here";  // 23
      context.atts["class"] = (context.atts["class"] || "") + " cfsaf-field";                           // 24
      return context;                                                                                   // 25
    }                                                                                                   // 26
  });                                                                                                   // 27
                                                                                                        // 28
  // Adds a custom "cfs-files" input type that AutoForm will recognize                                  // 29
  AutoForm.addInputType("cfs-files", {                                                                  // 30
    template:"cfsFilesField",                                                                           // 31
    valueOut: function () {                                                                             // 32
      return ["dummyId"];                                                                               // 33
    },                                                                                                  // 34
    contextAdjust: function (context) {                                                                 // 35
      context.atts.placeholder = context.atts.placeholder || "Click to upload files or drop them here"; // 36
      context.atts["class"] = (context.atts["class"] || "") + " cfsaf-field";                           // 37
      return context;                                                                                   // 38
    }                                                                                                   // 39
  });                                                                                                   // 40
                                                                                                        // 41
  function textInputAtts() {                                                                            // 42
    var atts = _.clone(this.atts);                                                                      // 43
    delete atts.collection;                                                                             // 44
    // we want the schema key tied to the hidden file field only                                        // 45
    delete atts["data-schema-key"];                                                                     // 46
    atts["class"] = (atts["class"] || "") + " form-control";                                            // 47
    return atts;                                                                                        // 48
  }                                                                                                     // 49
                                                                                                        // 50
  function fileInputAtts() {                                                                            // 51
    return {'data-schema-key': this.atts["data-schema-key"]};                                           // 52
  }                                                                                                     // 53
                                                                                                        // 54
  Template.cfsFileField_bootstrap3.helpers({                                                            // 55
    textInputAtts: textInputAtts,                                                                       // 56
    fileInputAtts: fileInputAtts                                                                        // 57
  });                                                                                                   // 58
                                                                                                        // 59
  Template.cfsFilesField_bootstrap3.helpers({                                                           // 60
    textInputAtts: textInputAtts,                                                                       // 61
    fileInputAtts: fileInputAtts                                                                        // 62
  });                                                                                                   // 63
                                                                                                        // 64
  var hookTracking = {};                                                                                // 65
  Template.cfsFileField_bootstrap3.rendered =                                                           // 66
  Template.cfsFilesField_bootstrap3.rendered = function () {                                            // 67
    var formId;                                                                                         // 68
                                                                                                        // 69
    // backwards compatibility with pre 5.0 autoform                                                    // 70
    if (typeof AutoForm.find === 'function') {                                                          // 71
      formId = AutoForm.find().formId;                                                                  // 72
    } else {                                                                                            // 73
      formId = AutoForm.getFormId();                                                                    // 74
    }                                                                                                   // 75
                                                                                                        // 76
    // By adding hooks dynamically on render, hopefully any user hooks will have                        // 77
    // been added before so we won't disrupt expected behavior.                                         // 78
    if (!hookTracking[formId]) {                                                                        // 79
      hookTracking[formId] = true;                                                                      // 80
      addAFHook(formId);                                                                                // 81
    }                                                                                                   // 82
  };                                                                                                    // 83
                                                                                                        // 84
  var singleHandler = function (event, template) {                                                      // 85
    var fileList = [];                                                                                  // 86
    FS.Utility.eachFile(event, function (f) {                                                           // 87
      fileList.push(f.name);                                                                            // 88
    });                                                                                                 // 89
    template.$('.cfsaf-field').val(fileList.join(", "));                                                // 90
    var fileList = event.originalEvent.dataTransfer ? event.originalEvent.dataTransfer.files : event.currentTarget.files;
    // Store the FileList on the file input for later                                                   // 92
    template.$('.cfsaf-hidden').data("cfsaf_files", fileList);                                          // 93
  };                                                                                                    // 94
                                                                                                        // 95
  Template.cfsFileField_bootstrap3.events({                                                             // 96
    'click .cfsaf-field': function (event, template) {                                                  // 97
      template.$('.cfsaf-hidden').click();                                                              // 98
    },                                                                                                  // 99
    'change .cfsaf-hidden': singleHandler,                                                              // 100
    'dropped .cfsaf-field': singleHandler                                                               // 101
  });                                                                                                   // 102
                                                                                                        // 103
  var multipleHandler = function (event, template) {                                                    // 104
    // Get the FileList object from the event object                                                    // 105
    var fileList = event.originalEvent.dataTransfer ? event.originalEvent.dataTransfer.files : event.currentTarget.files;
                                                                                                        // 107
    // Store the FileList on the file input for later. We store an array of                             // 108
    // separate FileList objects. Browsers don't let you add/remove items from                          // 109
    // an existing FileList.                                                                            // 110
    var fileListList = template.$('.cfsaf-hidden').data("cfsaf_files_multi") || [];                     // 111
    fileListList.push(fileList);                                                                        // 112
    template.$('.cfsaf-hidden').data("cfsaf_files_multi", fileListList);                                // 113
                                                                                                        // 114
    // Get full list of files to display in the visible, read-only field                                // 115
    var fullNameList = [];                                                                              // 116
    _.each(fileListList, function (fileList) {                                                          // 117
      _.each(fileList, function (f) {                                                                   // 118
        fullNameList.push(f.name);                                                                      // 119
      });                                                                                               // 120
    });                                                                                                 // 121
    template.$('.cfsaf-field').val(fullNameList.join(", "));                                            // 122
  };                                                                                                    // 123
                                                                                                        // 124
  Template.cfsFilesField_bootstrap3.events({                                                            // 125
    'click .cfsaf-field': function (event, template) {                                                  // 126
      template.$('.cfsaf-hidden').click();                                                              // 127
    },                                                                                                  // 128
    'change .cfsaf-hidden': multipleHandler,                                                            // 129
    'dropped .cfsaf-field': multipleHandler                                                             // 130
  });                                                                                                   // 131
                                                                                                        // 132
  function addAFHook(formId) {                                                                          // 133
    AutoForm.addHooks(formId, {                                                                         // 134
      before: {                                                                                         // 135
        // We add a before.insert hook to upload all the files in the form.                             // 136
        // This hook doesn't allow the form to continue submitting until                                // 137
        // all the files are successfully uploaded.                                                     // 138
        insert: CfsAutoForm.Hooks.beforeInsert,                                                         // 139
        update: CfsAutoForm.Hooks.beforeUpdate                                                          // 140
      },                                                                                                // 141
      after: {                                                                                          // 142
        // We add an after.insert hook to delete uploaded files if the doc insert fails.                // 143
        insert: CfsAutoForm.Hooks.afterInsert,                                                          // 144
        update: CfsAutoForm.Hooks.afterUpdate                                                           // 145
      }                                                                                                 // 146
    });                                                                                                 // 147
  }                                                                                                     // 148
}                                                                                                       // 149
                                                                                                        // 150
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("cfs:autoform", {
  CfsAutoForm: CfsAutoForm
});

})();
