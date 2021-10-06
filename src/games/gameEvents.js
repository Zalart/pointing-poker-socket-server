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
    KICK_PLAYER,
    BLOCK_APP,
    SET_GAME_DATA,
    START_GAME,
    GAME_STARTED,
    DISCONNECTING,
    PLAY_GAME_DATA,
    GET_PLAY_GAME_DATA,
    RESULTS_DATA,
    SAVE_GAME,
    RETURN_URL
  } from '../utils/constants';
  import store from './games';
  import { votes, Vote } from '../utils/vote';
  import { messToKick, firstMessToKick, drawToKick } from '../utils/vote';
  import { playGames, PlayGame } from '../utils/playGame';
  import { endPlayMessage } from '../utils/playGame';
  import * as fs from 'fs';
  
  export const gameEvents =  (io) => {
    io.on(CONNECTION, (socket) => {
        let userId = socket.id;
        let gameToBroadcast;
    
        try {
            // connect to lobby
          socket.on(CONNECT_LOBBY, ({ gameId, firstName, lastName, isObserver, isMaster, position, ava }) => {
            if (isMaster) {
            store.newGame(gameId);
            }
            if (!store.games[gameId]) {
              const gamesList = store.getGames(gameId);
              io.to(socket.id).emit(GAMES_LIST, gamesList);
            } else {
            socket.join(gameId);
            store.addUser(gameId, {userId, firstName, lastName, position, isObserver, isMaster, ava});
            gameToBroadcast = gameId;  
            io.to(gameToBroadcast).emit(LOBBY_CONNECTED, store.getGameData(gameToBroadcast), gameToBroadcast );
            }
          })



          socket.on(GET_GAME_DATA, gameId => {
            const gameData = store.getGameData(gameId);
            if (gameData) {
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
          
          socket.on(LEAVE_GAME,  ({ gameId, userId }) => {
            store.removeUser(gameId, userId);
            gameToBroadcast = gameId;
            const gameData = store.getGameData(gameId);
            io.to(gameToBroadcast).emit(GAME_DATA, gameData);
            socket.leave(gameId);
            if (playGames.has(gameId)) { PlayGame.deletePlayer({room: gameId, id: userId}) }
            if (store.checkRoom(gameId)) {
              if (playGames.has(gameId)) { playGames.delete(gameId) } 
            };
          })

    
          socket.on(SEND_MESSAGE, (message) => {
            io.to(gameToBroadcast).emit(RECEIVE_MESSAGE, { message, from: userId });
          })
    
          socket.on(DISCONNECT, () => {
            socket.to(gameToBroadcast).emit(USER_DISCONNECTED, userId);
          })

          socket.on(DISCONNECTING, () => {
            if (socket.rooms.size === 1) { return; }
            socket.rooms.delete(socket.id);
            const room = socket.rooms.values().next().value;
            store.removeUser(room, socket.id);
            socket.leave(room);
            if (playGames.has(room)) { PlayGame.deletePlayer({room, id: socket.id}) }
            if (store.checkRoom(room)) {
              if (playGames.has(room)) { playGames.delete(room) } 
            };
          })

          socket.on(KICK_PLAYER, (data) => {
            const {room, id, userToKickId} = data;
            if ((data.vote !== undefined) && votes.has(room)) { 
              const {vote} = data;
              const answer = votes.get(room).addVote({ vote, id });
              if (!answer) { return } 
              else {
                if (answer.kick === 'undefined') { io.to(id).emit(BLOCK_APP, { isBlock: true, message: answer.message }); return; }
                if (answer.kick === false) {
                  const userToKickId = votes.get(room).userToKickId; 
                  votes.delete(room);
                  socket.id = userToKickId;
                  socket.leave(room);
                  io.to(room).emit(BLOCK_APP, { isBlock: true, message: answer.message });
                  io.to(userToKickId).emit(BLOCK_APP, { isBlock: true, message: drawToKick });
                  socket.join(room);
                  return;
                }
                if (answer.kick === true) {
                  const userToKickId = votes.get(room).userToKickId; 
                  store.removeUser(room, userToKickId);
                  votes.delete(room);
                  const gameData = store.getGameData(room);
                  io.to(room).emit(GAME_DATA, gameData);
                  socket.id = userToKickId;
                  socket.leave(room);
                  if (playGames.has(room)) { PlayGame.deletePlayer({room, id: userToKickId}) }
                  io.to(room).emit(BLOCK_APP, { isBlock: true, message: answer.message });
                  io.to(userToKickId).emit(BLOCK_APP, { isBlock: true, message: messToKick });
                  return 
                }
              }
            }
            if (!votes.has(room)) {
              const user = store.getUsers(room).find((user) => user.userId === userToKickId);
              const userName = user.firstName;
              const usersNum = store.getUsers(room).length;
              votes.set(room, new Vote({ userName, usersNum, userToKickId }));
              socket.id = userToKickId;
              socket.leave(room);
              io.to(room).emit(BLOCK_APP, { isBlock: true, message: votes.get(room).sendMessage() });
              io.to(userToKickId).emit(BLOCK_APP, { isBlock: true, message: firstMessToKick });
              socket.join(room);
            }
          })

          socket.on(SET_GAME_DATA, ({ type, gameId, data }) => {
            switch (type) { 
              case 'get': const gameData1 = store.getGameData(gameId); io.to(gameId).emit(GAME_DATA, gameData1);  ; break;
              case 'post': store.setGameData({ gameId, data }); const gameData2 = store.getGameData(gameId); io.to(gameId).emit(GAME_DATA, gameData2); break;
              default: return;
            }
          })

          socket.on(START_GAME, ({ room }) => {
            if (!playGames.has(room)) { PlayGame.createNewGame(room); }
            else { return }
            io.to(room).emit(GAME_STARTED);
          })

          socket.on(GET_PLAY_GAME_DATA, ({ room, id, type, cardId }) => {
            switch (type) {
              case 'get' : const data = PlayGame.getUserData({ room, id }); io.to(id).emit(PLAY_GAME_DATA, data); break;
              case 'card_click' : {
                const result = PlayGame.cardClick({ room, id, cardId });
                const data = PlayGame.getUserData({ room, id });
                result ? io.to(id).emit(BLOCK_APP, { isBlock: true, message: endPlayMessage }) : io.to(id).emit(PLAY_GAME_DATA, data);
                if (result) {
                  const check = PlayGame.checkGame(room);
                  if (check) {
                    const results = PlayGame.getResults(room);
                    io.to(room).emit(BLOCK_APP, { isBlock: false, message: '' });
                    io.to(room).emit(RESULTS_DATA, results);
                  }
                }
              }; break;
              default : return;
            }
            
          })

          socket.on(SAVE_GAME, ({room, id}) => {
            const filename = new Date(Date.now()).toLocaleString().replace(/[\. ,]/g, '') + room;
            const textData = '';
            fs.writeFile(`./savedGames/${filename}.txt`, textData, (err) => {
              if (err) { console.log('Game was not saved.') }
            })
            io.to(id).emit(RETURN_URL, `https://pointing-poker-server.herokuapp.com/savedGames/${filename}.txt`)
          })

        } catch (error) {
          console.log(error)
        }
      })
  }
  