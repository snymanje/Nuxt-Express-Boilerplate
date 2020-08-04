const User = require('../models/userModel');
const AppError = require('../utils/appError');
const { userBasicInfo } = require('../utils/basicUserInfo');

const getUser = async (id) => {
  const user = await User.findOne({ _id: id });

  if (!user) throw new AppError('User not found...', 400);

  return {
    user: userBasicInfo(user),
  };
};

const getUsers = async () => {
  const users = await User.find({});

  if (!users) throw new AppError('Zero users found...', 400);

  const allUsers = users.map((user) => {
    return userBasicInfo(user);
  });

  return {
    users: allUsers,
  };
};

module.exports = {
  getUser,
  getUsers,
};
