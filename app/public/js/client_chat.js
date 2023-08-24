const socket = io();

const inputMessage = document.getElementById("input-messages");
const formElement = document.getElementById("form-messages");

// Acknowledgements function
const acknowledgements = (message) => {
  console.log("acknowledgements", message);
};

// nhận notice từ server
socket.on("send notice from server to client", (data) => {
  const previousHtml = document.getElementById("app__messages").innerHTML;
  const messageHtml = `
    <div class="message-item">
        <div class="notice__row">
            <p class="message__notice">----- ${data.textMessage} -----</p>
        </div>
    </div>
  `;
  let contentHtml = previousHtml + messageHtml;

  document.getElementById("app__messages").innerHTML = contentHtml;
});

// gửi tin nhắn về server
formElement.addEventListener("submit", (e) => {
  e.preventDefault();

  socket.emit(
    "send message from client to server",
    inputMessage.value,
    acknowledgements
  );

  // xóa input sau khi đã gửi message đến server
  document.getElementById("input-messages").value = "";
});

// Nhận lại tin nhắn của server gửi về
socket.on("send message from server to client", (data) => {
  const previousHtml = document.getElementById("app__messages").innerHTML;
  const messageHtml = `
    <div class="message-item">
        <div class="message__row1">
            <p class="message__name">${data.username}</p>
            <p class="message__date">${data.createAt}</p>
        </div>
        <div class="message__row2">
            <p class="message__content">
                ${data.textMessage}
            </p>
        </div>
    </div>
  `;
  let contentHtml = previousHtml + messageHtml;

  document.getElementById("app__messages").innerHTML = contentHtml;
});

/**
 *  Gửi vị trí
 */
const btnLocation = document.getElementById("btn-share-location");
btnLocation.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    // thông báo khi trình duyệt không hõ trợ location
    if (!navigator.geolocation) {
      return alert("Trình duyệt không hỗ trợ tìm vị trí!");
    }

    const { longitude, latitude } = position.coords;
    // console.log("url", url);

    // gửi vị trí lên server
    socket.emit("send locatin from client to server", { longitude, latitude });
  });
});

// lắng nghe sự kiện gửi vị trí
socket.on("send location from server to client", (data) => {
  console.log("position : ", data);
  const previousHtml = document.getElementById("app__messages").innerHTML;
  const messageHtml = `
    <div class="message-item">
        <div class="message__row1">
            <p class="message__name">${data.username}</p>
            <p class="message__date">${data.createAt}</p>
        </div>
        <div class="message__row2">
            <p class="message__content">
                <a href="${data.textMessage}" target="_blank">Đây là vị trí của ${data.username}</a>
            </p>
        </div>
    </div>
  `;
  let contentHtml = previousHtml + messageHtml;

  document.getElementById("app__messages").innerHTML = contentHtml;
});

/**
 *  Xử lý query string
 */
const queryParams = Qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});
const { room, username } = queryParams;

socket.emit("send room from client to server", { room, username });

// Thay đổi tên phòng chat
document.getElementById("app__title").innerHTML = room;

// Nhận danh sách từ server
socket.on("send userList from server to client", (userList) => {
  console.log("userList", userList);
  let htmlContent = "";
  userList.forEach((item) => {
    htmlContent += `
        <li class="app__item-user">${item.username}</li>
    `;
  });

  document.getElementById("app__list-user--content").innerHTML = htmlContent;
});
