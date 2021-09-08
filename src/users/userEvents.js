import {
    CONNECTION,
    DISCONNECT,
    JOIN_ROOM,
    SEND_MESSAGE,
    RECEIVE_MESSAGE,
    USER_CONNECTED,
    USER_DISCONNECTED,
  } from '../utils/constants';
  import store from './users';

  export const userEvents =  (io) => {
    io.on(CONNECTION, (socket) => {
        let userId;
        let roomToBroadcast;
    
        try {
          socket.on(JOIN_ROOM,  ({ room, id, firstName, lastName }) => {
            //здесь будет логика добавления пользователя в комнату
            store.addUser({id, firstName, lastName, room});
            userId = id;
            socket.join(room);
            roomToBroadcast = room;  
            socket.to(roomToBroadcast).emit(USER_CONNECTED, userId);
            io.to(roomToBroadcast).emit('SHOW_USERS', store.getUsers(roomToBroadcast));
          })

          socket.on('LEAVE_ROOM',  (id) => {
            //здесь будет логика удаления пользователя из комнаты
            const leavingUser = store.removeUser(id);
            userId = leavingUser.id;
            roomToBroadcast = leavingUser.room;  
            socket.leave(leavingUser.room);
            socket.to(roomToBroadcast).emit(USER_DISCONNECTED, userId);
            io.to(roomToBroadcast).emit('SHOW_USERS', store.getUsers(roomToBroadcast));
          })

    
          socket.on(SEND_MESSAGE, (message) => {
            io.to(roomToBroadcast).emit(RECEIVE_MESSAGE, { message, from: userId });
          })
    
          socket.on(DISCONNECT, () => {
            socket.to(roomToBroadcast).emit(USER_DISCONNECTED, userId);
          })


        } catch (error) {
          console.log(error)
        }

      })
  }
  