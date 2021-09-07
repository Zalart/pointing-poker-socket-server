import {
    CONNECTION,
    DISCONNECT,
    JOIN_ROOM,
    SEND_MESSAGE,
    RECEIVE_MESSAGE,
    USER_CONNECTED,
    USER_DISCONNECTED,
  } from '../utils/constants';
  import usersStore from './users';

  export const userEvents = (io) => {
    io.on(CONNECTION, (socket) => {
        let userId;
        let roomToBroadcast;
    
        try {
          socket.on(JOIN_ROOM, ({ room, id, firstName }) => {
            //здесь будет логика добавления пользователя в комнату
            userId = id;
            socket.join(room);
            roomToBroadcast = room;
            socket.to(roomToBroadcast).emit(USER_CONNECTED, userId);
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
  