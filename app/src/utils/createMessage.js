const format = require("date-format");

const createMessages = (textMessage, username) => {
  return {
    textMessage,
    username,
    createAt: format("dd/MM/yyyy - hh:mm:ss", new Date()),
  };
};

module.exports = { createMessages };
