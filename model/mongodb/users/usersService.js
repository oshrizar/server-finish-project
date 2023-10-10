const User = require("./Users");
const normalizationUserService = require("../../usersService/helpers/normalizationUserService");

const registerUser = (userData) => {
  const user = new User(userData);
  return user.save();
};

const getUserById = (id) => {
  return User.findById(id);
};
const getUserByEmail = (email) => {
  return User.findOne({ email });
};

const changeAdminStatusOfUser = (id) => {
  return User.findByIdAndUpdate(
    id,
    [{ $set: { isAdmin: { $eq: [false, "$isAdmin"] } } }],
    { new: true }
  );
};

const updateUserById = async (id, newUserData) => {
  return User.findByIdAndUpdate(
    id,
    await normalizationUserService(newUserData),
    {
      new: true,
    }
  );
};

const getAllUsers = () => {
  return User.find();
};

const deleteOneUser = (id) => {
  return User.findByIdAndDelete(id);
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
