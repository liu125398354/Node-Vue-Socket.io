/**
 * Created by liunannan on 2018/1/14.
 */
function webSocket(server) {
  const io = require('socket.io')(server);
  const underscore = require('underscore');
  let online = [];
  io.on('connection', function(socket) {
    let name = '';
    socket.on('setName', function(data) {
      console.log(data + ' 用户连接了');
      name = data;
      online[name] = socket.id;
      console.log(online);
    });
    socket.on('sayTo', function(data) {
      let from = data.from;
      let to = data.to;
      let own = online[from];
      let other = online[to];
      if (own && other) {
        let toOwn = underscore.findWhere(io.sockets.sockets, {id: own});
        let toOther = underscore.findWhere(io.sockets.sockets, {id: other});
        console.log('消息发送了');
        toOwn.emit('message', data);
        toOther.emit('message', data);
      }
    });
    socket.on('all', function(data) {
      io.emit('group', data);
    });
    socket.on('disconnect', function() {
      console.log(name + ' 离开了');
    });
  });
}
module.exports = webSocket;
