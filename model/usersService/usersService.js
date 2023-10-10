const config = require("config");
const usersServiceMongo = require("../mongodb/users/usersService");
const dbOption = config.get("dbOption");

const registerUser = (userData) => {
  if (dbOption === "mongo") {
    return usersServiceMongo.registerUser(userData);
  }
};
const getUserByEmail = (userData) => {
  if (dbOption === "mongo") {
    return usersServiceMongo.getUserByEmail(userData);
  }
};

const getUserById = (id) => {
  if (dbOption === "mongo") {
    return usersServiceMongo.getUserById(id);
  }
};

const getAllUsers = () => {
  if (dbOption === "mongo") {
    return usersServiceMongo.getAllUsers();
  }
};
const deleteOneUser = (id) => {
  if (dbOption === "mongo") {
    return usersServiceMongo.deleteOneUser(id);
  }
};
const changeAdminStatusOfUser = (id) => {
  if (dbOption === "mongo") {
    return usersServiceMongo.changeAdminStatusOfUser(id);
  }
};
const updateUserById = (id, newUserData) => {
  if (dbOption === "mongo") {
    return usersServiceMongo.updateUserById(id, newUserData);
  }
};

module.exports = {
  registerUser,
  getUserById,
  getAllUsers,
  deleteOneUser,
  changeAdminStatusOfUser,
  updateUserById,
  getUserByEmail,
};
