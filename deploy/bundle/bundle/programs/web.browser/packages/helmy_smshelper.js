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
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var i, code, count, smsHelper;

var require = meteorInstall({"node_modules":{"meteor":{"helmy:smshelper":{"smshelper.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/helmy_smshelper/smshelper.js                                                              //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
const module1 = module;
module1.export({
  name: () => name
});
const name = 'smshelper';

(function ($) {
  $.fn.extend({
    smsHelper: function (options) {
      // take the 1st element from the selected elements (because we're dealing with ID not classes)
      var $obj = this[0],
          //chunkSize = 160,
      defaults = {
        limit: false,
        chunk: 1,
        infoId: 'smsinfo',
        infoText: '',
        englishSize: {
          1: options.first_english,
          2: options.second_english,
          3: options.rest_english
        },
        unicodeSize: {
          1: options.first_unicode,
          2: options.second_unicode,
          3: options.rest_unicode
        },
        firstBracket: "(",
        lastBracket: ")",
        personalized: [],
        first_english: 160,
        second_english: 146,
        rest_english: 153,
        first_unicode: 70,
        second_unicode: 64,
        rest_unicode: 67,
        chars: ['|', '^', '€', '{', '}', '[', ']', '~', '\\']
      },
          settings = $.extend(defaults, options); // check if the message has any non ASCII character

      function hasUnicode(message) {
        for (i = 0; i < message.length; i++) {
          code = message.charCodeAt(i);
          var char = message[i];
          if (checkUniCode(char)) return true;
        }

        return false;
      }

      function checkUniCode(char) {
        var regex = /[-= \n\[\]\{\}\\^€|~@æΔSP0¡¿p£_!1AQaq$Φ"2BRbr¥Γ#3CcsèΛ¤4DTdtéΩ%5EUeuùΠ&6FVfvìΨ'7GWgwòΣ(8HXhxÇΘ)9IYiyLΞ*:JZjzØ+;KÄkäøÆ,<ÖlöMÑmñÅß.>NÜnüåÉ/?O§oà]/;
        return !regex.test(char);
      } // get (inner set) the chunk size


      function getChunkSize(message) {
        if (hasUnicode(message)) {
          chunkSize = settings.first_unicode; //67
        } else {
          chunkSize = settings.first_english; //153
        }

        return chunkSize;
      }

      var chunkSize = settings.first_english;

      function getChuncksCount(message) {
        var aText = hasUnicode(message) ? settings.unicodeSize : settings.englishSize;
        var textLength = message.length;
        var totalCount = 0;
        $.each(defaults.chars, function (index, value) {
          count = occurrences(message, value, false);
          totalCount = totalCount + count;
        });
        textLength = textLength + totalCount;
        var j = 1;
        chunkSize = 0;

        for (var i = 1; i <= 10; i++) {
          j = i > 3 ? 3 : i;
          chunkSize += aText[j];

          if (textLength - aText[j] <= 0) {
            return i;
          } else {
            textLength -= aText[j];
          }
        }
      } // display SMS information in the specific area (check out infoId)


      function displayTxt(length, chunks, text) {
        if (length > 0) {
          $(".saveTmplt").removeAttr("disabled");
          $("#saveTemplatemessageBody").text($("#SendSmsForm_message").val());
          $("#txtmessageBody").val($("#SendSmsForm_message").val());
        } else {
          $("#saveTemplate").attr("disabled", "disabled");
          $("#saveTemplatemessageBody").text("");
          $("#txtmessageBody").removeAttr('value');
        }

        var styled = settings.infoText + length + "/" + chunkSize + " " + settings.firstBracket + chunks + settings.lastBracket;
        $('#' + settings.infoId).html(styled);
      }

      function occurrences(string, subString, allowOverlapping) {
        string += "";
        subString += "";
        if (subString.length <= 0) return string.length + 1;
        var n = 0,
            pos = 0;
        var step = allowOverlapping ? 1 : subString.length;

        while (true) {
          pos = string.indexOf(subString, pos);

          if (pos >= 0) {
            ++n;
            pos += step;
          } else break;
        }

        return n;
      } // limit the text area characters


      function limitChars(textId) {
        var text = $(textId).val(),
            length = text.length,
            chunks = Math.ceil(text.length / getChunkSize(text)),
            limit = settings.chunk * getChunkSize(text);

        if (length > limit) {
          $(textId).val(text.substr(0, limit));
          return false;
        } else {
          displayTxt(length, chunks);
          return true;
        }
      }

      var findSubstitute = function (target, text) {
        target = target.toLocaleLowerCase();
        return jQuery.inArray(true, jQuery.map(res, function (s) {
          return s.toLocaleLowerCase().indexOf(target) > -1;
        }));
      };

      function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      } // plugin initializer


      function smsHelper() {
        // if the provided object doesn't exists; then create it.
        if ($('#' + settings.infoId).length == 0) {
          $($obj).after('<p class="counterSendMsg" id="' + settings.infoId + '"></p>');
        }

        var count = $('#SmsTemplates').val();

        if (typeof count === 'undefined') {
          displayTxt(0, 0, '');
        } else {
          displayTxt(count.length, Math.ceil(count.length / getChunkSize(count)), '');
        }

        $($obj).bind('keyup keydown', function () {
          var text = $($obj).val();
          var flag = 0;

          if (text != null) {
            var sub = settings.personalized;
            sub.forEach(function (entry) {
              if (text.indexOf(entry) >= 0 && flag == 0) {
                flag = 1;
              }
            });

            if (flag === 0) {
              $('#sms-info1').show();
              if (typeof $('#SendSmsForm_isPersonalized') != "undefined" && $('#SendSmsForm_isPersonalized') !== null) $('#SendSmsForm_isPersonalized').val(0);
              var length = text.replace(/\n/g, "22").length;
              var totalCount = 0;
              $.each(defaults.chars, function (index, value) {
                count = occurrences(text, value, false);
                totalCount = totalCount + count;
              });
              length = length + totalCount;
              var chunks = getChuncksCount(text); //Math.ceil(text.length / getChunkSize(text));
              // if the limit set to true; then limit the characters in the

              if (settings.limit == true) {
                limitChars($obj);
              } else {
                displayTxt(length, chunks, text);
              }
            } else {
              if (typeof $('#SendSmsForm_isPersonalized') != "undefined" && $('#SendSmsForm_isPersonalized') !== null) $('#SendSmsForm_isPersonalized').val(1);
              $('#sms-info1').hide();
            }
          }
        });
      } // initialize


      smsHelper();
    }
  });
})(jQuery);
////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("/node_modules/meteor/helmy:smshelper/smshelper.js");

/* Exports */
Package._define("helmy:smshelper", {
  smsHelper: smsHelper
});

})();
