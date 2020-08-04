const userService = require('../services/userService');

const sendResponse = async (res, statusCode, status, message, data) => {
  await res.status(statusCode).json({
    status,
    message,
    data,
  });
};

exports.getUser = async (req, res, next) => {
  const userId = req.user._id;
  const user = await userService.getUser(userId);
  sendResponse(res, 200, true, 'User details retrieved successfully', user);
};

exports.getUsers = async (req, res) => {
  const users = await userService.getUsers();
  sendResponse(res, 200, true, 'User details retrieved successfully', users);
};
