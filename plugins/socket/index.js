var listUser = new Map();
var counter = 0;
const prefix = 'room_';
var rooms = [];

const getRandomItem = list =>
  list.get([...list.keys()][Math.floor(Math.random() * list.size)]);

const socket = io => {
  io.on('connection', socket => {
    socket.on('MATCHING', (data, callback) => {
      if (listUser.has(data.username)) {
        callback({ code: -1, message: 'NO_NEED_RE_CONNECT' });
      } else {
        // add into list preparing
        // TODO: should set key is data.username
        listUser.set(counter, {
          ...data.data,
          socket: socket,
          id: socket.id,
          status: 'NOT_PAIR'
        });
        counter++;
        callback({ code: 1, message: 'CONNECTED' });
      }

      // random enemy
      if (counter >= 2) {
        while (1) {
          var enemy = getRandomItem(listUser);
          if (enemy.status === 'NOT_PAIR' && enemy.id !== socket.id) {
            console.log('PAIRED');
            const now = Math.floor(Date.now() / 1000);
            const room = prefix + now;

            // broadcast to 2 client paired
            console.log(socket.id, enemy.id);
            io.to(`${socket.id}`).emit('PAIRING', {
              room: room,
              isYourTurn: false
            });
            io.to(`${enemy.id}`).emit('PAIRING', {
              room: room,
              isYourTurn: true
            });
            counter -= 2;

            // set status paired

            // create new room for 2 players,
            // this room will listen all event from 2 players
            console.log('new room: ', room);
            newRoom(socket, enemy.socket, room);

            break;
          }
        }
      }

      // console.log(listUser);

      // disconnect event
      socket.on('disconnect', () => {
        console.log(socket.id, 'is disconnected');
        // listUser.delete()
      });
    });
  });
};

// create new room
const newRoom = (player1, player2, room) => {
  // join room
  player1.join(`${room}`);
  player2.join(`${room}`);

  // detect message
  detectMsg(player1, room);
  detectMsg(player2, room);
};

// detect event client send message to it own room
const detectMsg = (socket, room) => {
  socket.on(`${room}`, res => {
    console.log('data', res);
    sendData(socket, room, res.event, res.data);
  });
};

// sending to all clients in room, except sender
const sendData = (socket, room, event, data) => {
  console.log('event', event);
  // marshal data
  const dataStr = JSON.stringify(data);
  socket.to(`${room}`).emit(`${event}`, `${dataStr}`);
};

module.exports = {
  connect: io => {
    socket(io);
  }
};
