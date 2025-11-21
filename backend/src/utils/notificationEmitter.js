let emitter = null;

function setNotificationEmitter(fn) {
  emitter = fn;
}

function emitNotificationToUser(userId, payload) {
  if (emitter) {
    emitter(userId, payload);
  }
}

module.exports = { setNotificationEmitter, emitNotificationToUser };

