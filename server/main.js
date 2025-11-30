import { Meteor } from 'meteor/meteor';

if(Meteor.isClient){
  SimpleChat.configure ({
    texts:{
        loadMore: 'Load More',
        placeholder: 'Type message ...',
        button: 'send',
        join: 'Join to',
        left: 'Left the',
        room: 'room at'
    },
    limit: 5,
        beep: true,
        showViewed: true,
        showReceived: true,
        showJoined: true,
        publishChats: function(roomId, limit){ //server
            return true
        },
        allow: function(message, roomId, username, avatar, name){
            return true
        },
        onNewMessage:function(msg){  //both
        },
        onReceiveMessage:function(id, message, room){ //server

        },
        onJoin:function(roomId, username, name,date){  //server
        },
        onLeft:function(roomId, username, name,date) { //server
        }
    })
}
