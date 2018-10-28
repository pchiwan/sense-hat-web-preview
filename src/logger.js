module.exports = socket => {
  return {
    log: message => {
      socket.emit('message', message)
    }
  }
}
