const { Router } = require("express");
const router = Router();
const UserManager = require('../daos/userManager.js');
const users = new UserManager();
const userErrors = require('../errors/userErrors.js');
const logger = require("../config/logger.js");

// Endpoints usuarios
router.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/api/products');
  } else {
    res.render('login');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await users.loginUser(email, password);
    req.session.user = user;
    res.redirect('/api/products');
  } catch (error) {
    logger.error(`Error en la ruta POST '/login': ${error}`);
    res.render('login', { error: userErrors.LOGIN_FAILED });
  }
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    await users.registerUser({ email, password, role });
    res.redirect('/');
  } catch (err) {
    logger.error(`Error en la ruta POST '/register': ${err}`);
    res.render('register', { error: userErrors.REGISTER_FAILED });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
