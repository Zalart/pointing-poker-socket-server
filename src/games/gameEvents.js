import {
    CONNECTION,
    DISCONNECT,
    JOIN_GAME,
    LEAVE_GAME,
    CONNECT_LOBBY,
    GET_GAME_DATA,
    GAME_DATA,
    GET_GAMES_LIST,
    GAMES_LIST,
    LOBBY_CONNECTED,
    SEND_MESSAGE,
    RECEIVE_MESSAGE,
    USER_CONNECTED,
    USER_DISCONNECTED,
  } from '../utils/constants';
  import store from './games';

  export const gameEvents =  (io) => {
    io.on(CONNECTION, (socket) => {
        let userId = socket.id;
        let gameToBroadcast;
    
        try {
            // connect to lobby
          socket.on(CONNECT_LOBBY, ({ gameId, firstName, lastName, isObserver, isMaster }) => {
            // game master creates new game
            if (isMaster) {
            store.newGame(gameId);
            }
            // user enters the non-existing game
            if (!store.games[gameId]) {
              const gamesList = store.getGames(gameId);
              io.to(socket.id).emit(GAMES_LIST, gamesList);
            } else {
            // add user to game
            socket.join(gameId);
            store.addUser(gameId, {userId, firstName, lastName, isObserver, isMaster});
            gameToBroadcast = gameId;  
           // emit game data
            io.to(gameToBroadcast).emit(LOBBY_CONNECTED, store.getGameData(gameToBroadcast), gameToBroadcast );
            }
          })

          socket.on(GET_GAME_DATA, gameId => {
            const gameData = store.getGameData(gameId);
            if (gameData) {
              console.log('Game data on server', gameData)
              io.to(gameToBroadcast).emit(GAME_DATA, gameData);
              } else {
                const gamesList = store.getGames();
                if (gamesList) {
                  io.to(socket.id).emit(GAMES_LIST, gamesList);
                }
              }
          })

          socket.on(GET_GAMES_LIST, gameId => {
            const gamesList = store.getGames(gameId);
            io.emit(GAMES_LIST, gamesList);
          })
          
          socket.on(LEAVE_GAME,  (userId) => {
            //здесь будет логика удаления пользователя из комнаты
            const leavingUser = store.removeUser(id);
            userId = leavingUser.id;
            gameToBroadcast = leavingUser.game;  
            socket.leave(leavingUser.game);
            socket.to(gameToBroadcast).emit(USER_DISCONNECTED, userId);
            io.to(gameToBroadcast).emit('SHOW_USERS', store.getUsers(gameToBroadcast));
          })

    
          socket.on(SEND_MESSAGE, (message) => {
            io.to(gameToBroadcast).emit(RECEIVE_MESSAGE, { message, from: userId });
          })
    
          socket.on(DISCONNECT, () => {
            socket.to(gameToBroadcast).emit(USER_DISCONNECTED, userId);
          })


        } catch (error) {
          console.log(error)
        }
      })
  }
  