const createError = require('http-errors');
const User = require('../models/user');

function formatUser(user) {
  const data = user.toObject();

  data.id = data._id.toString();
  delete data._id;
  delete data.__v;
  delete data.password;

  return data;
}

async function addUser(req, res, next) {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      message: 'User added successfully.',
      data: formatUser(user)
    });
  } catch (error) {
    next(error);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const users = await User.find();

    res.json({
      success: true,
      message: 'Users list retrieved successfully.',
      data: users.map(formatUser)
    });
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(createError(404, 'User not found.'));
    }

    res.json({
      success: true,
      message: 'User retrieved successfully.',
      data: formatUser(user)
    });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updated: new Date()
      },
      { new: true }
    );

    if (!user) {
      return next(createError(404, 'User not found.'));
    }

    res.json({
      success: true,
      message: 'User updated successfully.'
    });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(createError(404, 'User not found.'));
    }

    res.json({
      success: true,
      message: 'User deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};