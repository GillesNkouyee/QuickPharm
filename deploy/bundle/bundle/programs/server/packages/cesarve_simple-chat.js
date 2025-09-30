(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var ECMAScript = Package.ecmascript.ECMAScript;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"cesarve:simple-chat":{"server.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/cesarve_simple-chat/server.js                                               //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
module.watch(require("./collections"));
module.watch(require("./publications"));
module.watch(require("./config"));
module.watch(require("./methods"));
module.watch(require("./methods_server"));
//////////////////////////////////////////////////////////////////////////////////////////

},"collections.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/cesarve_simple-chat/collections.js                                          //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
module.export({
  Chats: () => Chats,
  Rooms: () => Rooms
});
const Chats = new Meteor.Collection("simpleChats");
const Rooms = new Meteor.Collection("simpleRooms");
Chats.deny({
  insert() {
    return true;
  },

  update() {
    return true;
  },

  remove() {
    return true;
  }

});
Chats.allow({
  insert() {
    return false;
  },

  update() {
    return false;
  },

  remove() {
    return false;
  }

});
Rooms.deny({
  insert() {
    return true;
  },

  update() {
    return true;
  },

  remove() {
    return true;
  }

});
Chats.allow({
  insert() {
    return false;
  },

  update() {
    return false;
  },

  remove() {
    return false;
  }

});
//////////////////////////////////////////////////////////////////////////////////////////

},"config.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/cesarve_simple-chat/config.js                                               //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
module.export({
  SimpleChat: () => SimpleChat
});
const SimpleChat = {
  options: {
    texts: {
      loadMore: 'Load More',
      placeholder: 'Type message ...',
      button: 'send',
      join: 'joined the',
      left: 'left',
      room: 'room at'
    },
    limit: 50,
    beep: false,
    showViewed: false,
    showReceived: false,
    showJoined: false,
    publishChats: function (roomId, limi) {
      return true;
    },
    allow: function (message, roomId, username, avatar, name) {
      return true;
    },
    onNewMessage: function (msg) {
      console.log(msg);
    },
    onReceiveMessage: function () {},
    onJoin: function (roomId, username, name, date) {//server
    },
    onLeft: function (roomId, username, name, date) {//server
    },
    height: '300px',
    inputTemplate: 'SimpleChatInput',
    loadMoreTemplate: 'LoadMore'
  },
  configure: function (options) {
    this.options = this.options || {};

    _.extend(this.options, options);

    return this;
  }
};
//////////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/cesarve_simple-chat/methods.js                                              //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let check;
module.watch(require("meteor/check"), {
  check(v) {
    check = v;
  }

}, 1);
let Match;
module.watch(require("meteor/check"), {
  Match(v) {
    Match = v;
  }

}, 2);
let Chats;
module.watch(require("./collections"), {
  Chats(v) {
    Chats = v;
  }

}, 3);
let SimpleChat;
module.watch(require("./config"), {
  SimpleChat(v) {
    SimpleChat = v;
  }

}, 4);
Meteor.methods({
  "SimpleChat.newMessage": function (message, roomId, username, avatar, name, custom) {
    check(message, String);
    check(roomId, String);
    check(username, Match.Maybe(String));
    check(avatar, Match.Maybe(String));
    check(name, Match.Maybe(String));
    check(custom, Match.Any);
    this.unblock();
    if (!SimpleChat.options.allow.call(this, message, roomId, username, avatar, name)) throw new Meteor.Error(403, "Access deny");
    message = _.escape(message);
    const msg = {
      message,
      roomId,
      username,
      name,
      sent: !this.isSimulation,
      receivedBy: [],
      receivedAll: false,
      viewedBy: [],
      viewedAll: false,
      userId: this.userId,
      avatar,
      custom,
      date: new Date()
    };
    msg._id = Chats.insert(msg);
    SimpleChat.options.onNewMessage(msg);
    return msg;
  }
});
//////////////////////////////////////////////////////////////////////////////////////////

},"methods_server.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/cesarve_simple-chat/methods_server.js                                       //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let check;
module.watch(require("meteor/check"), {
  check(v) {
    check = v;
  }

}, 1);
let Chats;
module.watch(require("./collections"), {
  Chats(v) {
    Chats = v;
  }

}, 2);
let Rooms;
module.watch(require("./collections"), {
  Rooms(v) {
    Rooms = v;
  }

}, 3);
let SimpleChat;
module.watch(require("./config"), {
  SimpleChat(v) {
    SimpleChat = v;
  }

}, 4);
//todo improve security, for now any body con access to this methods and potentially change the data  (off messages recieved or room joins no a big deal but have to be fixed)
Meteor.methods({
  "SimpleChat.messageReceived": function (id, username) {
    check(id, String);
    check(username, String);
    this.unblock();
    if (!SimpleChat.options.showReceived) return false;

    Meteor._sleepForMs(800 * Meteor.isDevelopment);

    const message = Chats.findOne(id, {
      fields: {
        roomId: 1,
        receivedBy: 1
      }
    });
    if (!message) throw Meteor.Error(403, "Message does not exist");
    const room = Rooms.findOne(message.roomId);

    if (!_.contains(message.receivedBy, username)) {
      return Chats.update(id, {
        $addToSet: {
          receivedBy: username
        },
        $set: {
          receivedAll: room.usernames.length - 2 <= message.receivedBy.length
        }
      });
    }

    SimpleChat.options.onReceiveMessage(id, message, room);
    return false;
  },
  "SimpleChat.join": function (roomId, username, avatar, name) {
    check(roomId, String);
    check(username, String);
    check(avatar, Match.Maybe(String));
    check(name, Match.Maybe(String));
    this.unblock();
    if (!SimpleChat.options.showViewed) return false; //todo remove

    Meteor._sleepForMs(800 * Meteor.isDevelopment);

    const date = new Date();

    if (SimpleChat.options.showJoined) {
      Chats.insert({
        roomId,
        username,
        name,
        avatar,
        date,
        join: true
      });
    }

    Rooms.upsert(roomId, {
      $addToSet: {
        usernames: username
      }
    });
    this.connection.onClose(function () {
      Chats.insert({
        roomId,
        username,
        name,
        avatar,
        date: new Date(),
        join: false
      });
      Rooms.update(roomId, {
        $pull: {
          usernames: username
        }
      });
      SimpleChat.options.onLeft(roomId, username, name, date);
    });
    SimpleChat.options.onJoin(roomId, username, name, date);
  },
  "SimpleChat.messageViewed": function (id, username) {
    check(id, String);
    check(username, String);
    this.unblock();
    if (!SimpleChat.options.showViewed) return false; //todo remove

    Meteor._sleepForMs(800 * Meteor.isDevelopment);

    const message = Chats.findOne(id, {
      fields: {
        roomId: 1,
        viewedBy: 1
      }
    });
    if (!message) throw Meteor.Error(403, "Message does not exist");
    const room = Rooms.findOne(message.roomId);

    if (!_.contains(message.viewedBy, username)) {
      return Chats.update(id, {
        $addToSet: {
          viewedBy: username
        },
        $set: {
          viewedAll: room.usernames.length - 2 <= message.viewedBy.length
        }
      });
    }

    return false;
  }
});
//////////////////////////////////////////////////////////////////////////////////////////

},"publications.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/cesarve_simple-chat/publications.js                                         //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let check;
module.watch(require("meteor/check"), {
  check(v) {
    check = v;
  }

}, 1);
let Chats;
module.watch(require("./collections"), {
  Chats(v) {
    Chats = v;
  }

}, 2);
let SimpleChat;
module.watch(require("./config"), {
  SimpleChat(v) {
    SimpleChat = v;
  }

}, 3);
Meteor.publish("simpleChats", function (roomId, limit) {
  check(roomId, String);
  check(limit, Number);
  if (!roomId) return;
  if (!SimpleChat.options.publishChats.call(this, roomId, limit)) return [];
  var query = {
    roomId: roomId
  };
  if (!SimpleChat.options.showJoined) query.message = {
    $exists: 1
  };
  var options = {
    sort: {
      date: -1
    }
  };
  if (limit) options.limit = limit;
  return Chats.find(query, options);
});
//////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("/node_modules/meteor/cesarve:simple-chat/server.js");

/* Exports */
Package._define("cesarve:simple-chat", exports);

})();

//# sourceURL=meteor://💻app/packages/cesarve_simple-chat.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY2VzYXJ2ZTpzaW1wbGUtY2hhdC9zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2Nlc2FydmU6c2ltcGxlLWNoYXQvY29sbGVjdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2Nlc2FydmU6c2ltcGxlLWNoYXQvY29uZmlnLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jZXNhcnZlOnNpbXBsZS1jaGF0L21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2Nlc2FydmU6c2ltcGxlLWNoYXQvbWV0aG9kc19zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2Nlc2FydmU6c2ltcGxlLWNoYXQvcHVibGljYXRpb25zLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsIndhdGNoIiwicmVxdWlyZSIsImV4cG9ydCIsIkNoYXRzIiwiUm9vbXMiLCJNZXRlb3IiLCJDb2xsZWN0aW9uIiwiZGVueSIsImluc2VydCIsInVwZGF0ZSIsInJlbW92ZSIsImFsbG93IiwiU2ltcGxlQ2hhdCIsIm9wdGlvbnMiLCJ0ZXh0cyIsImxvYWRNb3JlIiwicGxhY2Vob2xkZXIiLCJidXR0b24iLCJqb2luIiwibGVmdCIsInJvb20iLCJsaW1pdCIsImJlZXAiLCJzaG93Vmlld2VkIiwic2hvd1JlY2VpdmVkIiwic2hvd0pvaW5lZCIsInB1Ymxpc2hDaGF0cyIsInJvb21JZCIsImxpbWkiLCJtZXNzYWdlIiwidXNlcm5hbWUiLCJhdmF0YXIiLCJuYW1lIiwib25OZXdNZXNzYWdlIiwibXNnIiwiY29uc29sZSIsImxvZyIsIm9uUmVjZWl2ZU1lc3NhZ2UiLCJvbkpvaW4iLCJkYXRlIiwib25MZWZ0IiwiaGVpZ2h0IiwiaW5wdXRUZW1wbGF0ZSIsImxvYWRNb3JlVGVtcGxhdGUiLCJjb25maWd1cmUiLCJfIiwiZXh0ZW5kIiwidiIsImNoZWNrIiwiTWF0Y2giLCJtZXRob2RzIiwiY3VzdG9tIiwiU3RyaW5nIiwiTWF5YmUiLCJBbnkiLCJ1bmJsb2NrIiwiY2FsbCIsIkVycm9yIiwiZXNjYXBlIiwic2VudCIsImlzU2ltdWxhdGlvbiIsInJlY2VpdmVkQnkiLCJyZWNlaXZlZEFsbCIsInZpZXdlZEJ5Iiwidmlld2VkQWxsIiwidXNlcklkIiwiRGF0ZSIsIl9pZCIsImlkIiwiX3NsZWVwRm9yTXMiLCJpc0RldmVsb3BtZW50IiwiZmluZE9uZSIsImZpZWxkcyIsImNvbnRhaW5zIiwiJGFkZFRvU2V0IiwiJHNldCIsInVzZXJuYW1lcyIsImxlbmd0aCIsInVwc2VydCIsImNvbm5lY3Rpb24iLCJvbkNsb3NlIiwiJHB1bGwiLCJwdWJsaXNoIiwiTnVtYmVyIiwicXVlcnkiLCIkZXhpc3RzIiwic29ydCIsImZpbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPQyxLQUFQLENBQWFDLFFBQVEsZUFBUixDQUFiO0FBQXVDRixPQUFPQyxLQUFQLENBQWFDLFFBQVEsZ0JBQVIsQ0FBYjtBQUF3Q0YsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLFVBQVIsQ0FBYjtBQUFrQ0YsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLFdBQVIsQ0FBYjtBQUFtQ0YsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLGtCQUFSLENBQWIsRTs7Ozs7Ozs7Ozs7QUNBcEpGLE9BQU9HLE1BQVAsQ0FBYztBQUFDQyxTQUFNLE1BQUlBLEtBQVg7QUFBaUJDLFNBQU0sTUFBSUE7QUFBM0IsQ0FBZDtBQUFPLE1BQU1ELFFBQVEsSUFBSUUsT0FBT0MsVUFBWCxDQUFzQixhQUF0QixDQUFkO0FBQ0EsTUFBTUYsUUFBUSxJQUFJQyxPQUFPQyxVQUFYLENBQXNCLGFBQXRCLENBQWQ7QUFFUEgsTUFBTUksSUFBTixDQUFXO0FBQ1BDLFdBQVM7QUFDTCxXQUFPLElBQVA7QUFDSCxHQUhNOztBQUlQQyxXQUFTO0FBQ0wsV0FBTyxJQUFQO0FBQ0gsR0FOTTs7QUFPUEMsV0FBUztBQUNMLFdBQU8s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QW5CLENBQWdDOEIsSUFBaEMsQ0FBcUMsSUFBckMsRUFBMkM3QixNQUEzQyxFQUFtRE4sS0FBbkQsQ0FBTCxFQUFnRSxPQUFPLEVBQVA7QUFFaEUsTUFBSStELFFBQVE7QUFDUnpELFlBQVFBO0FBREEsR0FBWjtBQUdBLE1BQUksQ0FBQ2YsV0FBV0MsT0FBWCxDQUFtQlksVUFBeEIsRUFDSTJELE1BQU12RCxPQUFOLEdBQWdCO0FBQUN3RCxhQUFTO0FBQVYsR0FBaEI7QUFDSixNQUFJeEUsVUFBVTtBQUFDeUUsVUFBTTtBQUFDL0MsWUFBTSxDQUFDO0FBQVI7QUFBUCxHQUFkO0FBQ0EsTUFBSWxCLEtBQUosRUFDSVIsUUFBUVEsS0FBUixHQUFnQkEsS0FBaEI7QUFDSixTQUFPbEIsTUFBTW9GLElBQU4sQ0FBV0gsS0FBWCxFQUFrQnZFLE9BQWxCLENBQVA7QUFDSCxDQWhCRCxFIiwiZmlsZSI6Ii9wYWNrYWdlcy9jZXNhcnZlX3NpbXBsZS1jaGF0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IGNlc2FyIG9uIDcvMTEvMTYuXG4gKi9cbmltcG9ydCAnLi9jb2xsZWN0aW9ucydcbmltcG9ydCAnLi9wdWJsaWNhdGlvbnMnXG5pbXBvcnQgJy4vY29uZmlnJ1xuaW1wb3J0ICcuL21ldGhvZHMnXG5pbXBvcnQgJy4vbWV0aG9kc19zZXJ2ZXInIiwiZXhwb3J0IGNvbnN0IENoYXRzID0gbmV3IE1ldGVvci5Db2xsZWN0aW9uKFwic2ltcGxlQ2hhdHNcIilcbmV4cG9ydCBjb25zdCBSb29tcyA9IG5ldyBNZXRlb3IuQ29sbGVjdGlvbihcInNpbXBsZVJvb21zXCIpXG5cbkNoYXRzLmRlbnkoe1xuICAgIGluc2VydCgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgcmVtb3ZlKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxufSk7XG5DaGF0cy5hbGxvdyh7XG4gICAgaW5zZXJ0KCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIHJlbW92ZSgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG59KTtcblxuUm9vbXMuZGVueSh7XG4gICAgaW5zZXJ0KCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICByZW1vdmUoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG59KTtcbkNoYXRzLmFsbG93KHtcbiAgICBpbnNlcnQoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgcmVtb3ZlKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbn0pO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGNlc2FyIG9uIDI1LzIvMTYuXG4gKi9cbmV4cG9ydCBjb25zdCBTaW1wbGVDaGF0ID0ge1xuICAgIG9wdGlvbnM6ICB7XG4gICAgICAgIHRleHRzOiB7XG4gICAgICAgICAgICBsb2FkTW9yZTogJ0xvYWQgTW9yZScsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogJ1R5cGUgbWVzc2FnZSAuLi4nLFxuICAgICAgICAgICAgYnV0dG9uOiAnc2VuZCcsXG4gICAgICAgICAgICBqb2luOiAnam9pbmVkIHRoZScsXG4gICAgICAgICAgICBsZWZ0OiAnbGVmdCcsXG4gICAgICAgICAgICByb29tOiAncm9vbSBhdCdcblxuICAgICAgICB9LFxuICAgICAgICBsaW1pdDogNTAsXG4gICAgICAgIGJlZXA6IGZhbHNlLFxuICAgICAgICBzaG93Vmlld2VkOiBmYWxzZSxcbiAgICAgICAgc2hvd1JlY2VpdmVkOiBmYWxzZSxcbiAgICAgICAgc2hvd0pvaW5lZDogZmFsc2UsXG4gICAgICAgIHB1Ymxpc2hDaGF0czogZnVuY3Rpb24gKHJvb21JZCwgbGltaSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3c6IGZ1bmN0aW9uIChtZXNzYWdlLCByb29tSWQsIHVzZXJuYW1lLCBhdmF0YXIsIG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIG9uTmV3TWVzc2FnZTogZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKVxuICAgICAgICB9LFxuICAgICAgICBvblJlY2VpdmVNZXNzYWdlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgfSxcbiAgICAgICAgb25Kb2luOiBmdW5jdGlvbiAocm9vbUlkLCB1c2VybmFtZSwgbmFtZSxkYXRlKSB7XG4gICAgICAgICAgICAvL3NlcnZlclxuICAgICAgICB9LFxuICAgICAgICBvbkxlZnQ6IGZ1bmN0aW9uIChyb29tSWQsIHVzZXJuYW1lLCBuYW1lLGRhdGUpIHtcbiAgICAgICAgICAgIC8vc2VydmVyXG4gICAgICAgIH0sXG4gICAgICAgIGhlaWdodDogJzMwMHB4JyxcbiAgICAgICAgaW5wdXRUZW1wbGF0ZTogJ1NpbXBsZUNoYXRJbnB1dCcsXG4gICAgICAgIGxvYWRNb3JlVGVtcGxhdGU6ICdMb2FkTW9yZScsXG4gICAgfSxcbiAgICBjb25maWd1cmU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHRoaXMub3B0aW9ucyB8fCB7fTtcbiAgICAgICAgXy5leHRlbmQodGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG4iLCJpbXBvcnQge01ldGVvcn0gZnJvbSAnbWV0ZW9yL21ldGVvcidcbmltcG9ydCB7Y2hlY2t9IGZyb20gJ21ldGVvci9jaGVjaydcbmltcG9ydCB7TWF0Y2h9IGZyb20gJ21ldGVvci9jaGVjaydcbmltcG9ydCB7Q2hhdHN9IGZyb20gJy4vY29sbGVjdGlvbnMnXG5pbXBvcnQge1NpbXBsZUNoYXR9IGZyb20gJy4vY29uZmlnJ1xuTWV0ZW9yLm1ldGhvZHMoe1xuICAgIFwiU2ltcGxlQ2hhdC5uZXdNZXNzYWdlXCI6IGZ1bmN0aW9uIChtZXNzYWdlLCByb29tSWQsIHVzZXJuYW1lLCBhdmF0YXIsIG5hbWUsIGN1c3RvbSkge1xuICAgICAgICBjaGVjayhtZXNzYWdlLCBTdHJpbmcpO1xuICAgICAgICBjaGVjayhyb29tSWQsIFN0cmluZyk7XG4gICAgICAgIGNoZWNrKHVzZXJuYW1lLCBNYXRjaC5NYXliZShTdHJpbmcpKTtcbiAgICAgICAgY2hlY2soYXZhdGFyLCBNYXRjaC5NYXliZShTdHJpbmcpKTtcbiAgICAgICAgY2hlY2sobmFtZSwgTWF0Y2guTWF5YmUoU3RyaW5nKSk7XG4gICAgICAgIGNoZWNrKGN1c3RvbSwgTWF0Y2guQW55ICk7XG5cbiAgICAgICAgdGhpcy51bmJsb2NrKClcbiAgICAgICAgaWYgKCFTaW1wbGVDaGF0Lm9wdGlvbnMuYWxsb3cuY2FsbCh0aGlzLCBtZXNzYWdlLCByb29tSWQsIHVzZXJuYW1lLCBhdmF0YXIsIG5hbWUpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiQWNjZXNzIGRlbnlcIilcbiAgICAgICAgbWVzc2FnZT1fLmVzY2FwZShtZXNzYWdlKVxuXG4gICAgICAgIGNvbnN0IG1zZz17XG4gICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgcm9vbUlkLFxuICAgICAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgc2VudDogIXRoaXMuaXNTaW11bGF0aW9uLFxuICAgICAgICAgICAgcmVjZWl2ZWRCeTogW10sXG4gICAgICAgICAgICByZWNlaXZlZEFsbDogZmFsc2UsXG4gICAgICAgICAgICB2aWV3ZWRCeTogW10sXG4gICAgICAgICAgICB2aWV3ZWRBbGw6IGZhbHNlLFxuICAgICAgICAgICAgdXNlcklkOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICAgIGF2YXRhcixcbiAgICAgICAgICAgIGN1c3RvbSxcbiAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKClcbiAgICAgICAgfVxuICAgICAgICBtc2cuX2lkPUNoYXRzLmluc2VydChtc2cpXG4gICAgICAgIFNpbXBsZUNoYXQub3B0aW9ucy5vbk5ld01lc3NhZ2UobXNnKVxuICAgICAgICByZXR1cm4gbXNnXG4gICAgfVxufSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGNlc2FyIG9uIDIzLzIvMTYuXG4gKi9cbmltcG9ydCB7TWV0ZW9yfSBmcm9tICdtZXRlb3IvbWV0ZW9yJ1xuaW1wb3J0IHtjaGVja30gZnJvbSAnbWV0ZW9yL2NoZWNrJ1xuaW1wb3J0IHtDaGF0c30gZnJvbSAnLi9jb2xsZWN0aW9ucydcbmltcG9ydCB7Um9vbXN9IGZyb20gJy4vY29sbGVjdGlvbnMnXG5pbXBvcnQge1NpbXBsZUNoYXR9IGZyb20gJy4vY29uZmlnJ1xuXG4vL3RvZG8gaW1wcm92ZSBzZWN1cml0eSwgZm9yIG5vdyBhbnkgYm9keSBjb24gYWNjZXNzIHRvIHRoaXMgbWV0aG9kcyBhbmQgcG90ZW50aWFsbHkgY2hhbmdlIHRoZSBkYXRhICAob2ZmIG1lc3NhZ2VzIHJlY2lldmVkIG9yIHJvb20gam9pbnMgbm8gYSBiaWcgZGVhbCBidXQgaGF2ZSB0byBiZSBmaXhlZClcbk1ldGVvci5tZXRob2RzKHtcbiAgICBcIlNpbXBsZUNoYXQubWVzc2FnZVJlY2VpdmVkXCI6IGZ1bmN0aW9uIChpZCwgdXNlcm5hbWUpIHtcblxuICAgICAgICBjaGVjayhpZCwgU3RyaW5nKVxuICAgICAgICBjaGVjayh1c2VybmFtZSwgU3RyaW5nKVxuXG4gICAgICAgIHRoaXMudW5ibG9jaygpXG4gICAgICAgIGlmICghU2ltcGxlQ2hhdC5vcHRpb25zLnNob3dSZWNlaXZlZCkgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgTWV0ZW9yLl9zbGVlcEZvck1zKDgwMCAqIE1ldGVvci5pc0RldmVsb3BtZW50KVxuICAgICAgICBjb25zdCBtZXNzYWdlID0gQ2hhdHMuZmluZE9uZShpZCwge2ZpZWxkczoge3Jvb21JZDogMSwgcmVjZWl2ZWRCeTogMX19KVxuICAgICAgICBpZiAoIW1lc3NhZ2UpXG4gICAgICAgICAgICB0aHJvdyBNZXRlb3IuRXJyb3IoNDAzLCBcIk1lc3NhZ2UgZG9lcyBub3QgZXhpc3RcIilcbiAgICAgICAgY29uc3Qgcm9vbSA9IFJvb21zLmZpbmRPbmUobWVzc2FnZS5yb29tSWQpXG4gICAgICAgIGlmICghXy5jb250YWlucyhtZXNzYWdlLnJlY2VpdmVkQnksIHVzZXJuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIENoYXRzLnVwZGF0ZShpZCwge1xuICAgICAgICAgICAgICAgICRhZGRUb1NldDoge3JlY2VpdmVkQnk6IHVzZXJuYW1lfSxcbiAgICAgICAgICAgICAgICAkc2V0OiB7cmVjZWl2ZWRBbGw6IHJvb20udXNlcm5hbWVzLmxlbmd0aCAtIDIgPD0gbWVzc2FnZS5yZWNlaXZlZEJ5Lmxlbmd0aH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgU2ltcGxlQ2hhdC5vcHRpb25zLm9uUmVjZWl2ZU1lc3NhZ2UoaWQsIG1lc3NhZ2UsIHJvb20pXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH0sXG4gICAgXCJTaW1wbGVDaGF0LmpvaW5cIjogZnVuY3Rpb24gKHJvb21JZCwgdXNlcm5hbWUsIGF2YXRhciwgbmFtZSkge1xuICAgICAgICBjaGVjayhyb29tSWQsIFN0cmluZyk7XG4gICAgICAgIGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xuICAgICAgICBjaGVjayhhdmF0YXIsIE1hdGNoLk1heWJlKFN0cmluZykpO1xuICAgICAgICBjaGVjayhuYW1lLCBNYXRjaC5NYXliZShTdHJpbmcpKTtcbiAgICAgICAgdGhpcy51bmJsb2NrKClcbiAgICAgICAgaWYgKCFTaW1wbGVDaGF0Lm9wdGlvbnMuc2hvd1ZpZXdlZCkgcmV0dXJuIGZhbHNlXG4gICAgICAgIC8vdG9kbyByZW1vdmVcbiAgICAgICAgTWV0ZW9yLl9zbGVlcEZvck1zKDgwMCAqIE1ldGVvci5pc0RldmVsb3BtZW50KVxuXG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpXG4gICAgICAgIGlmIChTaW1wbGVDaGF0Lm9wdGlvbnMuc2hvd0pvaW5lZCkge1xuICAgICAgICAgICAgQ2hhdHMuaW5zZXJ0KHtcbiAgICAgICAgICAgICAgICByb29tSWQsXG4gICAgICAgICAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICBhdmF0YXIsXG4gICAgICAgICAgICAgICAgZGF0ZSxcbiAgICAgICAgICAgICAgICBqb2luOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIFJvb21zLnVwc2VydChyb29tSWQsIHskYWRkVG9TZXQ6IHt1c2VybmFtZXM6IHVzZXJuYW1lfX0pXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5vbkNsb3NlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIENoYXRzLmluc2VydCh7XG4gICAgICAgICAgICAgICAgcm9vbUlkLFxuICAgICAgICAgICAgICAgIHVzZXJuYW1lLFxuICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgYXZhdGFyLFxuICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAgICAgam9pbjogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBSb29tcy51cGRhdGUocm9vbUlkLCB7JHB1bGw6IHt1c2VybmFtZXM6IHVzZXJuYW1lfX0pXG4gICAgICAgICAgICBTaW1wbGVDaGF0Lm9wdGlvbnMub25MZWZ0KHJvb21JZCwgdXNlcm5hbWUsIG5hbWUsIGRhdGUpXG4gICAgICAgIH0pXG4gICAgICAgIFNpbXBsZUNoYXQub3B0aW9ucy5vbkpvaW4ocm9vbUlkLCB1c2VybmFtZSwgbmFtZSwgZGF0ZSlcbiAgICB9LFxuICAgIFwiU2ltcGxlQ2hhdC5tZXNzYWdlVmlld2VkXCI6IGZ1bmN0aW9uIChpZCwgdXNlcm5hbWUpIHtcbiAgICAgICAgY2hlY2soaWQsIFN0cmluZyk7XG4gICAgICAgIGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xuICAgICAgICB0aGlzLnVuYmxvY2soKVxuICAgICAgICBpZiAoIVNpbXBsZUNoYXQub3B0aW9ucy5zaG93Vmlld2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgLy90b2RvIHJlbW92ZVxuICAgICAgICBNZXRlb3IuX3NsZWVwRm9yTXMoODAwICogTWV0ZW9yLmlzRGV2ZWxvcG1lbnQpXG5cbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IENoYXRzLmZpbmRPbmUoaWQsIHtmaWVsZHM6IHtyb29tSWQ6IDEsIHZpZXdlZEJ5OiAxfX0pXG4gICAgICAgIGlmICghbWVzc2FnZSlcbiAgICAgICAgICAgIHRocm93IE1ldGVvci5FcnJvcig0MDMsIFwiTWVzc2FnZSBkb2VzIG5vdCBleGlzdFwiKVxuICAgICAgICBjb25zdCByb29tID0gUm9vbXMuZmluZE9uZShtZXNzYWdlLnJvb21JZClcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKG1lc3NhZ2Uudmlld2VkQnksIHVzZXJuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIENoYXRzLnVwZGF0ZShpZCwge1xuICAgICAgICAgICAgICAgICRhZGRUb1NldDoge3ZpZXdlZEJ5OiB1c2VybmFtZX0sXG4gICAgICAgICAgICAgICAgJHNldDoge3ZpZXdlZEFsbDogcm9vbS51c2VybmFtZXMubGVuZ3RoIC0gMiA8PSBtZXNzYWdlLnZpZXdlZEJ5Lmxlbmd0aH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSxcbn0pIiwiaW1wb3J0IHtNZXRlb3J9IGZyb20gJ21ldGVvci9tZXRlb3InXG5pbXBvcnQge2NoZWNrfSBmcm9tICdtZXRlb3IvY2hlY2snXG5pbXBvcnQge0NoYXRzfSBmcm9tICcuL2NvbGxlY3Rpb25zJ1xuaW1wb3J0IHtTaW1wbGVDaGF0fSBmcm9tICcuL2NvbmZpZydcblxuXG5NZXRlb3IucHVibGlzaChcInNpbXBsZUNoYXRzXCIsIGZ1bmN0aW9uIChyb29tSWQsIGxpbWl0KSB7XG4gICAgY2hlY2socm9vbUlkLCBTdHJpbmcpXG4gICAgY2hlY2sobGltaXQsIE51bWJlcilcbiAgICBpZiAoIXJvb21JZClcbiAgICAgICAgcmV0dXJuXG4gICAgaWYgKCFTaW1wbGVDaGF0Lm9wdGlvbnMucHVibGlzaENoYXRzLmNhbGwodGhpcywgcm9vbUlkLCBsaW1pdCkpIHJldHVybiBbXVxuXG4gICAgdmFyIHF1ZXJ5ID0ge1xuICAgICAgICByb29tSWQ6IHJvb21JZFxuICAgIH07XG4gICAgaWYgKCFTaW1wbGVDaGF0Lm9wdGlvbnMuc2hvd0pvaW5lZClcbiAgICAgICAgcXVlcnkubWVzc2FnZSA9IHskZXhpc3RzOiAxfVxuICAgIHZhciBvcHRpb25zID0ge3NvcnQ6IHtkYXRlOiAtMX19XG4gICAgaWYgKGxpbWl0KVxuICAgICAgICBvcHRpb25zLmxpbWl0ID0gbGltaXRcbiAgICByZXR1cm4gQ2hhdHMuZmluZChxdWVyeSwgb3B0aW9ucyk7XG59KTtcblxuIl19
