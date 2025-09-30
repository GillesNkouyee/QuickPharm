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

/* Package-scope variables */
var SimpleExcel;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/stef_import-export-excel/packages/stef_import-export-excel.js                                //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/stef:import-export-excel/stef:import-export-excel.js                                  //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
// SimpleExcel.js v0.1.3                                                                          // 1
// Client-side script to easily parse / convert / write any Microsoft Excel XLSX / XML / CSV / TSV / HTML / JSON / etc formats
// https://github.com/faisalman/simple-excel-js                                                   // 3
//                                                                                                // 4
// Copyright © 2013-2014 Faisal Salman <fyzlman@gmail.com>                                        // 5
// Dual licensed under GPLv2 & MIT                                                                // 6
                                                                                                  // 7
(function (window, undefined) {                                                                   // 8
                                                                                                  // 9
    'use strict';                                                                                 // 10
                                                                                                  // 11
    ///////////////////////                                                                       // 12
    // Constants & Helpers                                                                        // 13
    ///////////////////////                                                                       // 14
                                                                                                  // 15
    var Char = {                                                                                  // 16
        COMMA           : ',',                                                                    // 17
        RETURN          : '\r',                                                                   // 18
        NEWLINE         : '\n',                                                                   // 19
        SEMICOLON       : ';',                                                                    // 20
        TAB             : '\t'                                                                    // 21
    };                                                                                            // 22
                                                                                                  // 23
    var DataType = {                                                                              // 24
        CURRENCY    : 'CURRENCY',                                                                 // 25
        DATETIME    : 'DATETIME',                                                                 // 26
        FORMULA     : 'FORMULA',                                                                  // 27
        LOGICAL     : 'LOGICAL',                                                                  // 28
        NUMBER      : 'NUMBER',                                                                   // 29
        TEXT        : 'TEXT'                                                                      // 30
    };                                                                                            // 31
                                                                                                  // 32
    var Exception = {                                                                             // 33
        CELL_NOT_FOUND              : 'CELL_NOT_FOUND',                                           // 34
        COLUMN_NOT_FOUND            : 'COLUMN_NOT_FOUND',                                         // 35
        ROW_NOT_FOUND               : 'ROW_NOT_FOUND',                                            // 36
        ERROR_READING_FILE          : 'ERROR_READING_FILE',                                       // 37
        ERROR_WRITING_FILE          : 'ERROR_WRITING_FILE',                                       // 38
        FILE_NOT_FOUND              : 'FILE_NOT_FOUND',                                           // 39
        //FILE_EXTENSION_MISMATCH     : 'FILE_EXTENSION_MISMATCH',                                // 40
        FILETYPE_NOT_SUPPORTED      : 'FILETYPE_NOT_SUPPORTED',                                   // 41
        INVALID_DOCUMENT_FORMAT     : 'INVALID_DOCUMENT_FORMAT',                                  // 42
        INVALID_DOCUMENT_NAMESPACE  : 'INVALID_DOCUMENT_NAMESPACE',                               // 43
        MALFORMED_JSON              : 'MALFORMED_JSON',                                           // 44
        UNIMPLEMENTED_METHOD        : 'UNIMPLEMENTED_METHOD',                                     // 45
        UNKNOWN_ERROR               : 'UNKNOWN_ERROR',                                            // 46
        UNSUPPORTED_BROWSER         : 'UNSUPPORTED_BROWSER'                                       // 47
    };                                                                                            // 48
                                                                                                  // 49
    var Format = {                                                                                // 50
        CSV     : 'csv',                                                                          // 51
        HTML    : 'html',                                                                         // 52
        JSON    : 'json',                                                                         // 53
        TSV     : 'tsv',                                                                          // 54
        XLS     : 'xls',                                                                          // 55
        XLSX    : 'xlsx',                                                                         // 56
        XML     : 'xml'                                                                           // 57
    };                                                                                            // 58
                                                                                                  // 59
    var MIMEType = {                                                                              // 60
        CSV     : 'text/csv',                                                                     // 61
        HTML    : 'text/html',                                                                    // 62
        JSON    : 'application/json',                                                             // 63
        TSV     : 'text/tab-separated-values',                                                    // 64
        XLS     : 'application/vnd.ms-excel',                                                     // 65
        XLSX    : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',            // 66
        XML     : 'text/xml',                                                                     // 67
        XML2003 : 'application/xml'                                                               // 68
    };                                                                                            // 69
                                                                                                  // 70
    var Regex = {                                                                                 // 71
        FILENAME    : /.*\./g,                                                                    // 72
        LINEBREAK   : /\r\n/g                                                                     // 73
    };                                                                                            // 74
                                                                                                  // 75
    var Utils = {                                                                                 // 76
        getFiletype : function (filename) {                                                       // 77
            return filename.replace(Regex.FILENAME, '');                                          // 78
        },                                                                                        // 79
        isEqual     : function (str1, str2, ignoreCase) {                                         // 80
            return ignoreCase ? str1.toLowerCase() == str2.toLowerCase() : str1 == str2;          // 81
        },                                                                                        // 82
        isSupportedBrowser : function () {                                                        // 83
            return !![].forEach                                                                   // 84
                && !!window.FileReader;                                                           // 85
        },                                                                                        // 86
        overrideProperties : function (old, fresh) {                                              // 87
            for (var i in old) {                                                                  // 88
                if (old.hasOwnProperty(i)) {                                                      // 89
                    old[i] = fresh.hasOwnProperty(i) ? fresh[i] : old[i];                         // 90
                }                                                                                 // 91
            }                                                                                     // 92
            return old;                                                                           // 93
        }                                                                                         // 94
    };                                                                                            // 95
                                                                                                  // 96
    /////////////////////////////                                                                 // 97
    // Spreadsheet Constructors                                                                   // 98
    ////////////////////////////                                                                  // 99
                                                                                                  // 100
    var Cell = function (value, dataType) {                                                       // 101
        var defaults = {                                                                          // 102
            value    : value || '',                                                               // 103
            dataType : dataType || DataType.TEXT                                                  // 104
        };                                                                                        // 105
        if (typeof value == typeof {}) {                                                          // 106
            defaults = Utils.overrideProperties(defaults, value);                                 // 107
        }                                                                                         // 108
        this.value = defaults.value;                                                              // 109
        this.dataType = defaults.dataType;                                                        // 110
        this.toString = function () {                                                             // 111
            return value.toString();                                                              // 112
        }                                                                                         // 113
    };                                                                                            // 114
                                                                                                  // 115
    var Records = function () {};                                                                 // 116
    Records.prototype = new Array();                                                              // 117
    Records.prototype.getCell = function (colNum, rowNum) {                                       // 118
        return this[rowNum - 1][colNum - 1];                                                      // 119
    };                                                                                            // 120
    Records.prototype.getColumn = function (colNum) {                                             // 121
        var col = [];                                                                             // 122
        this.forEach(function (el, i) {                                                           // 123
            col.push(el[colNum - 1]);                                                             // 124
        });                                                                                       // 125
        return col;                                                                               // 126
    };                                                                                            // 127
    Records.prototype.getRow = function (rowNum) {                                                // 128
        return this[rowNum - 1];                                                                  // 129
    };                                                                                            // 130
                                                                                                  // 131
    var Sheet = function () {                                                                     // 132
        this.records = new Records();                                                             // 133
    };                                                                                            // 134
    Sheet.prototype.getCell = function (colNum, rowNum) {                                         // 135
        return this.records.getCell(colNum, rowNum);                                              // 136
    };                                                                                            // 137
    Sheet.prototype.getColumn = function (colNum) {                                               // 138
        return this.records.getColumn(colNum);                                                    // 139
    };                                                                                            // 140
    Sheet.prototype.getRow = function (rowNum) {                                                  // 141
        return this.records.getRow(rowNum);                                                       // 142
    };                                                                                            // 143
    Sheet.prototype.insertRecord = function (array) {                                             // 144
        this.records.push(array);                                                                 // 145
        return this;                                                                              // 146
    };                                                                                            // 147
    Sheet.prototype.removeRecord = function (index) {                                             // 148
        this.records.splice(index - 1, 1);                                                        // 149
        return this;                                                                              // 150
    };                                                                                            // 151
    Sheet.prototype.setRecords = function (records) {                                             // 152
        this.records = records;                                                                   // 153
        return this;                                                                              // 154
    };                                                                                            // 155
                                                                                                  // 156
    /////////////                                                                                 // 157
    // Parsers                                                                                    // 158
    ////////////                                                                                  // 159
                                                                                                  // 160
    // Base Class                                                                                 // 161
    var BaseParser = function () {};                                                              // 162
    BaseParser.prototype = {                                                                      // 163
        _filetype   : '',                                                                         // 164
        _sheet      : [],                                                                         // 165
        getSheet    : function (number) {                                                         // 166
            var number = number || 1;                                                             // 167
            return this._sheet[number - 1].records;                                               // 168
        },                                                                                        // 169
        loadFile    : function (file, callback) {                                                 // 170
            var self = this;                                                                      // 171
            //var filetype = Utils.getFiletype(file.name);                                        // 172
            //if (Utils.isEqual(filetype, self._filetype, true)) {                                // 173
                var reader = new FileReader();                                                    // 174
                reader.onload = function () {                                                     // 175
                    self.loadString(this.result, 0);                                              // 176
                    callback.apply(self);                                                         // 177
                };                                                                                // 178
                reader.readAsText(file);                                                          // 179
            //} else {                                                                            // 180
                //throw Exception.FILE_EXTENSION_MISMATCH;                                        // 181
            //}                                                                                   // 182
            return self;                                                                          // 183
        },                                                                                        // 184
        loadString  : function (string, sheetnum) {                                               // 185
            throw Exception.UNIMPLEMENTED_METHOD;                                                 // 186
        }                                                                                         // 187
    };                                                                                            // 188
                                                                                                  // 189
    // CSV                                                                                        // 190
    var CSVParser = function () {};                                                               // 191
    CSVParser.prototype = new BaseParser();                                                       // 192
    CSVParser.prototype._delimiter = Char.COMMA;                                                  // 193
    CSVParser.prototype._filetype = Format.CSV;                                                   // 194
    CSVParser.prototype.loadString = function (str, sheetnum) {                                   // 195
        // TODO: implement real CSV parser                                                        // 196
        var self = this;                                                                          // 197
        var sheetnum = sheetnum || 0;                                                             // 198
        self._sheet[sheetnum] = new Sheet();                                                      // 199
        str.replace(Regex.LINEBREAK, Char.NEWLINE).split(Char.NEWLINE).forEach(function (el, i) { // 200
            var row = [];                                                                         // 201
            el.split(self._delimiter).forEach(function (el) {                                     // 202
                row.push(new Cell(el));                                                           // 203
            });                                                                                   // 204
            self._sheet[sheetnum].insertRecord(row);                                              // 205
        });                                                                                       // 206
        return self;                                                                              // 207
    };                                                                                            // 208
    CSVParser.prototype.setDelimiter = function (separator) {                                     // 209
        this._delimiter = separator;                                                              // 210
        return this;                                                                              // 211
    };                                                                                            // 212
                                                                                                  // 213
    // HTML                                                                                       // 214
    var HTMLParser = function () {};                                                              // 215
    HTMLParser.prototype = new BaseParser();                                                      // 216
    HTMLParser.prototype._filetype = Format.HTML;                                                 // 217
    HTMLParser.prototype.loadString = function (str, sheetnum) {                                  // 218
        var self = this;                                                                          // 219
        var sheetnum = sheetnum || 0;                                                             // 220
        var domParser = new DOMParser();                                                          // 221
        var domTree = domParser.parseFromString(str, MIMEType.HTML);                              // 222
        var sheets = domTree.getElementsByTagName('table');                                       // 223
        [].forEach.call(sheets, function (el, i) {                                                // 224
            self._sheet[sheetnum] = new Sheet();                                                  // 225
            var rows = el.getElementsByTagName('tr');                                             // 226
            [].forEach.call(rows, function (el, i) {                                              // 227
                var cells = el.getElementsByTagName('td');                                        // 228
                var row = [];                                                                     // 229
                [].forEach.call(cells, function (el, i) {                                         // 230
                    row.push(new Cell(el.innerHTML));                                             // 231
                });                                                                               // 232
                self._sheet[sheetnum].insertRecord(row);                                          // 233
            });                                                                                   // 234
            sheetnum++;                                                                           // 235
        });                                                                                       // 236
        return self;                                                                              // 237
    };                                                                                            // 238
                                                                                                  // 239
    // TSV                                                                                        // 240
    var TSVParser = function () {};                                                               // 241
    TSVParser.prototype = new CSVParser();                                                        // 242
    TSVParser.prototype._delimiter = Char.TAB;                                                    // 243
    TSVParser.prototype._filetype = Format.TSV;                                                   // 244
                                                                                                  // 245
    // XML                                                                                        // 246
    var XMLParser = function () {};                                                               // 247
    XMLParser.prototype = new BaseParser();                                                       // 248
    XMLParser.prototype._filetype = Format.XML;                                                   // 249
    XMLParser.prototype.loadString = function (str, sheetnum) {                                   // 250
        var self = this;                                                                          // 251
        var sheetnum = sheetnum || 0;                                                             // 252
        var domParser = new DOMParser();                                                          // 253
        var domTree = domParser.parseFromString(str, MIMEType.XML);                               // 254
        var sheets = domTree.getElementsByTagName('Worksheet');                                   // 255
        [].forEach.call(sheets, function (el, i) {                                                // 256
            self._sheet[sheetnum] = new Sheet();                                                  // 257
            var rows = el.getElementsByTagName('Row');                                            // 258
            [].forEach.call(rows, function (el, i) {                                              // 259
                var cells = el.getElementsByTagName('Data');                                      // 260
                var row = [];                                                                     // 261
                [].forEach.call(cells, function (el, i) {                                         // 262
                    row.push(new Cell(el.innerHTML));                                             // 263
                });                                                                               // 264
                self._sheet[sheetnum].insertRecord(row);                                          // 265
            });                                                                                   // 266
            sheetnum++;                                                                           // 267
        });                                                                                       // 268
        return self;                                                                              // 269
    };                                                                                            // 270
                                                                                                  // 271
    // Export var                                                                                 // 272
    var Parser = {                                                                                // 273
        CSV : CSVParser,                                                                          // 274
        HTML: HTMLParser,                                                                         // 275
        TSV : TSVParser,                                                                          // 276
        XML : XMLParser                                                                           // 277
    };                                                                                            // 278
                                                                                                  // 279
    /////////////                                                                                 // 280
    // Writers                                                                                    // 281
    ////////////                                                                                  // 282
                                                                                                  // 283
    // Base Class                                                                                 // 284
    var BaseWriter = function () {};                                                              // 285
    BaseWriter.prototype = {                                                                      // 286
        _filetype   : '',                                                                         // 287
        _mimetype   : '',                                                                         // 288
        _sheet      : [],                                                                         // 289
        getSheet    : function (number) {                                                         // 290
            var number = number || 1;                                                             // 291
            return this._sheet[number - 1].records;                                               // 292
        },                                                                                        // 293
        getString   : function () {                                                               // 294
            throw Exception.UNIMPLEMENTED_METHOD;                                                 // 295
        },                                                                                        // 296
        insertSheet : function (data) {                                                           // 297
            if (!!data.records) {                                                                 // 298
                this._sheet.push(data);                                                           // 299
            } else {                                                                              // 300
                var sheet = new Sheet();                                                          // 301
                sheet.setRecords(data);                                                           // 302
                this._sheet.push(sheet);                                                          // 303
            }                                                                                     // 304
            return this;                                                                          // 305
        },                                                                                        // 306
        removeSheet : function (index) {                                                          // 307
            this._sheet.splice(index - 1, 1);                                                     // 308
            return this;                                                                          // 309
        },                                                                                        // 310
        saveFile    : function () {                                                               // 311
            // TODO: find a reliable way to save as local file                                    // 312
            window.open('data:' + this._mimetype + ';base64,' + window.btoa(this.getString()));   // 313
            return this;                                                                          // 314
        }                                                                                         // 315
    };                                                                                            // 316
                                                                                                  // 317
    // CSV                                                                                        // 318
    var CSVWriter = function () {};                                                               // 319
    CSVWriter.prototype = new BaseWriter();                                                       // 320
    CSVWriter.prototype._delimiter = Char.COMMA;                                                  // 321
    CSVWriter.prototype._filetype = Format.CSV;                                                   // 322
    CSVWriter.prototype._mimetype = MIMEType.CSV;                                                 // 323
    CSVWriter.prototype.getString = function () {                                                 // 324
        // TODO: implement real CSV writer                                                        // 325
        var self = this;                                                                          // 326
        var string = '';                                                                          // 327
        this.getSheet(1).forEach(function (el, i) {                                               // 328
            el.forEach(function (el) {                                                            // 329
                string += el + self._delimiter;                                                   // 330
            });                                                                                   // 331
            string += '\r\n';                                                                     // 332
        });                                                                                       // 333
        return string;                                                                            // 334
    };                                                                                            // 335
    CSVWriter.prototype.setDelimiter = function (separator) {                                     // 336
        this._delimiter = separator;                                                              // 337
        return this;                                                                              // 338
    };                                                                                            // 339
                                                                                                  // 340
    // TSV                                                                                        // 341
    var TSVWriter = function () {};                                                               // 342
    TSVWriter.prototype = new CSVWriter();                                                        // 343
    TSVWriter.prototype._delimiter = Char.TAB;                                                    // 344
    TSVWriter.prototype._filetype = Format.TSV;                                                   // 345
    TSVWriter.prototype._mimetype = MIMEType.TSV;                                                 // 346
                                                                                                  // 347
    // Export var                                                                                 // 348
    var Writer = {                                                                                // 349
        CSV : CSVWriter,                                                                          // 350
        TSV : TSVWriter                                                                           // 351
    };                                                                                            // 352
                                                                                                  // 353
    /////////////                                                                                 // 354
    // Exports                                                                                    // 355
    ////////////                                                                                  // 356
                                                                                                  // 357
    var SimpleExcel = {                                                                           // 358
        Cell                : Cell,                                                               // 359
        DataType            : DataType,                                                           // 360
        Exception           : Exception,                                                          // 361
        isSupportedBrowser  : Utils.isSupportedBrowser(),                                         // 362
        Parser              : Parser,                                                             // 363
        Sheet               : Sheet,                                                              // 364
        Writer              : Writer                                                              // 365
    };                                                                                            // 366
                                                                                                  // 367
    window.SimpleExcel = SimpleExcel;                                                             // 368
    return SimpleExcel;                                                                           // 369
})(this);                                                                                         // 370
                                                                                                  // 371
////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

///////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("stef:import-export-excel", {
  SimpleExcel: SimpleExcel
});

})();
