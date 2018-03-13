const actions = {
  'SEND_MESSAGE': (socket, message) => {
    const params = {
      'message': message
    };

    socket.emit('user::message', params);
  }
};

module.exports = actions;
