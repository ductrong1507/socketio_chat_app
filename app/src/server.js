const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const { createMessages } = require("./utils/createMessage");
const {
  getUserList,
  addUser,
  removeUser,
  findUserById,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// static file
app.use(express.static(path.join(__dirname, "..", "public")));

// lắng  nghe sự kiện connection từ client
io.on("connection", (socket) => {
  // xử lý lắng nghe sự kiện gửi user và room
  socket.on("send room from client to server", ({ room, username }) => {
    socket.join(room);

    // gửi tin nhắn chào mừng cho client với vào
    socket.emit(
      "send notice from server to client",
      createMessages(`Chào mừng bạn đến với nhóm chat ${room}`)
    );

    // gửi tin cho các client còn lại có người tham gia
    socket.broadcast
      .to(room)
      .emit(
        "send notice from server to client",
        createMessages(`${username} mới gia nhập nhóm chat`)
      );

    /**
     * Phần Chat
     */

    // Nhận tin nhắn từ client
    socket.on("send message from client to server", (message, callback) => {
      // tìm user nào đã gửi tin nhắn
      const user = findUserById(socket.id);

      // gửi tin nhắn đã nhận lại cho tất cả người dùng
      io.to(room).emit(
        "send message from server to client",
        createMessages(message, user.username)
      );

      callback("Gửi tin nhắn thành công");
    });

    // Nhận vị trí và gửi lại cho tất cả người dùng
    socket.on(
      "send locatin from client to server",
      ({ longitude, latitude }) => {
        const locationLink = `https://www.google.com/maps/place/${latitude},${longitude}`;

        // tìm user nào đã gửi tin nhắn
        const user = findUserById(socket.id);

        io.to(room).emit(
          "send location from server to client",
          createMessages(locationLink, user.username)
        );
      }
    );

    /**
     * thao tác với danh sách user
     */
    const newUser = {
      id: socket.id,
      username,
      room,
    };
    addUser(newUser);
    io.to(room).emit("send userList from server to client", getUserList(room));

    //   xử lý ngắt kết nối
    socket.on("disconnect", () => {
      console.log("Client disconnect");

      removeUser(socket.id);
      io.to(room).emit(
        "send userList from server to client",
        getUserList(room)
      );

      socket.broadcast
        .to(room)
        .emit(
          "send notice from server to client",
          createMessages(`${username} đã rời nhóm chat`)
        );
    });
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
