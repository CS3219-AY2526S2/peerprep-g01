const registerMatchingHandlers = (io, socket) => {
  // We'll fill this in next
  socket.on("joinQueue", (data) => {
    console.log("joinQueue received:", data);
  });
};
module.exports = { registerMatchingHandlers };