import rooms from '../rooms/rooms';

export const userEvents =  (io) => {
  io.on('connection', (socket) => {
    try {
      socket.on('create_session', (data) => {  //создание новой игры
      const {sessionName, user} = data;
      if (rooms.has(sessionName)) { console.log(`ROOM ${sessionName} IS ALREADY CREATED!!!`) }  //проверка имени комнаты
      else if (socket.rooms.size < 2) {  //проверка что пользователь не находится в другой комнате
        user.id = socket.id;
        user.status = 'connect'
        const roomInfo = {users: [], cards: [], issues: []};
        roomInfo.users.push(user);
        rooms.set(sessionName, roomInfo);
        socket.join(sessionName);
      } else { console.log('YOU ARE IN THE ROOM! LEAVE IT AND TRY AGAIN!') }
    })

      socket.on('join_game', (data) => {   //присоединение к игре
        const {sessionName, user} = data;
        if (!rooms.has(sessionName)) { console.log(`ROOM ${sessionName} IS NOT CREATED!!!`) } //проверка имени комнаты
        else { if (rooms.get(sessionName).users.find(function(user) { if (user.name === this.name) {return true} }, user)) { // проверка что такого пользователя нет в комнате
          console.log(`USER ${user.name} IS ALREADY IN ROOM!`) }
        else {
          const roomInfo = rooms.get(sessionName);
          user.id = socket.id;
          user.status = 'connect';
          roomInfo.users.push(user);
          rooms.set(sessionName, roomInfo);
          socket.join(sessionName);
          console.log(rooms.get(sessionName).users)
        }
        }
      })

    } catch (error) {
        console.log(error);
    }

 })
}
  