import rooms from '../rooms/rooms';

export const userEvents =  (io) => {
  io.on('connection', (socket) => {
    try {
      socket.on('create_session', (data) => {
      const {sessionName, user} = data;
      if (rooms.has(sessionName)) { console.log(`ROOM ${sessionName} IS ALREADY CREATED!!!`) }
      else if (socket.rooms.size < 2) {
        user.id = socket.id;
        const roomInfo = {users: [], cards: [], issues: []};
        roomInfo.users.push(user);
        rooms.set(sessionName, roomInfo);
        socket.join(sessionName);
        console.log(rooms.get(sessionName));
      } else { console.log('YOU ARE IN THE ROOM! LEAVE IT AND TRY AGAIN!') }
    })

    } catch (error) {
        console.log(error);
      //return;
    }

 })
}
  