const bcrypt = require('bcrypt');
const User = require('./models/user.Models.js');
const userErrors = require('../errors/userErrors.js');

class UserManager {
  async registerUser(userData) {
    try {
      const userExists = await User.findOne({ email: userData.email });

      if (userExists) {
        throw new Error(userErrors.USER_EXISTS);
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = {
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'usuario',
      };

      const result = await User.create(newUser);

      return result;
    } catch (error) {
      console.error(`Error al registrar al usuario: ${error}`);
      throw new Error(userErrors.GENERAL_ERROR);
    }
  }

  async loginUser(email, password) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error(userErrors.USER_NOT_FOUND);
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new Error(userErrors.INVALID_PASSWORD);
      }

      return user;
    } catch (error) {
      console.error(`Error al iniciar sesión del usuario: ${error}`);
      throw new Error(userErrors.GENERAL_ERROR);
    }
  }

  async getUserRole(email) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error(userErrors.USER_NOT_FOUND);
      }

      return user.role;
    } catch (error) {
      console.error(`Error al obtener el rol del usuario: ${error}`);
      throw new Error(userErrors.GENERAL_ERROR);
    }
  }
}

module.exports = UserManager;
