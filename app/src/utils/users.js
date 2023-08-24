let userList = [
  {
    id: "01",
    username: "Allen",
    room: "nodejs10",
  },
  {
    id: "02",
    username: "Luffy",
    room: "nodejs12",
  },

  {
    id: "03",
    username: "Sanji",
    room: "nodejs12",
  },
];

const getUserList = (room) => {
  return userList.filter((user) => user.room == room);
};

const addUser = (newUser) => {
  userList = [...userList, newUser];
  return userList;
};

const removeUser = (userId) => {
  const index = userList.findIndex((item) => item.id == userId);

  if (index !== -1) {
    userList.splice(index, 1);
  }

  return userList;
};

const findUserById = (userId) => {
  return userList.find((user) => user.id == userId);
};

module.exports = {
  getUserList,
  addUser,
  removeUser,
  findUserById,
};
