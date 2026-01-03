const { authService, emailService } = require('../services');
const { status } = require('http-status');

const authController = {
  async register(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await authService.createUser(email, password);
      const token = await authService.genAuthToken(user);

      // send verification email
      await emailService.registerEmail(email, user);
      // send a response
      res.cookie('x-access-token', token).status(status.CREATED).send({
        user,
        token,
      });
    } catch (error) {
      // res.status(status.BAD_REQUEST).send(error.message);
      next(error);
    }
  },

  async signin(req, res, next) {
    try {
      // body
      const { email, password } = req.body;

      // sign in user
      const user = await authService.signInWithEmailAndPassword(
        email,
        password
      );

      // gen token
      const token = await authService.genAuthToken(user);

      // send res
      res.cookie('x-access-token', token).send({
        user,
        token,
      });
    } catch (error) {
      // res.status(status.BAD_REQUEST).send(error.message);
      next(error);
    }
  },

  async isauth(req, res, next) {
    res.json(req.user);
  },

  async testrole(req, res, next) {
    res.json(req.user);
  },
};

module.exports = authController;
