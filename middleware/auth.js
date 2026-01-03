const passport = require('passport');
const { ApiError } = require('./apiError');
const { status } = require('http-status');
const { roles } = require('../config/roles');

const verify = (req, res, resolve, reject, rights) => async (err, user) => {
  if (err || !user) {
    return reject(
      new ApiError(status.UNAUTHORIZED, 'Вибачте, Ви не авторизовані')
    );
  }
  req.user = {
    _id: user._id,
    email: user.email,
    role: user.role,
    firstname: user.firstname,
    lastname: user.lastname,
    age: user.age,
    verified: user.verified,
  };

  if (rights.length) {
    const action = rights[0]; // createAny, readAny ....
    const resource = rights[1]; // profile, articles, test
    const permission = roles.can(req.user.role)[action](resource);
    if (!permission.granted) {
      return reject(
        new ApiError(status.FORBIDDEN, 'Вибачте, Ви не маєте достатньо прав')
      );
    }
    res.locals.permission = permission;
  }

  resolve();
};

const auth =
  (...rights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        verify(req, res, resolve, reject, rights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
