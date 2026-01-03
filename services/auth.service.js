const { User } = require('../models/userModel');
const usersService = require('./users.service');
const { ApiError } = require('../middleware/apiError');
const { status } = require('http-status');

const createUser = async (email, password) => {
  try {
    if (await User.emailTaken(email)) {
      // throw new Error('Вибачте, email вже використовується');
      throw new ApiError(
        status.BAD_REQUEST,
        'Вибачте, email вже використовується'
      );
    }

    const user = new User({
      email,
      password,
    });

    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

const genAuthToken = (user) => {
  const token = user.generateAuthToken();
  return token;
};

const signInWithEmailAndPassword = async (email, password) => {
  try {
    const user = await usersService.findUserByEmail(email);
    if (!user) {
      // throw new Error('Вибачте, невірний email');
      throw new ApiError(status.BAD_REQUEST, 'Вибачте, невірний email');
    }

    // validate password
    if (!(await user.comparePassword(password))) {
      // throw new Error('Вибачте, невірний пароль');
      throw new ApiError(status.BAD_REQUEST, 'Вибачте, невірний пароль');
    }

    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  genAuthToken,
  signInWithEmailAndPassword,
};
