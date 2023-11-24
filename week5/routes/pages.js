const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/', (req, res) => {
    res.render('INDEX');
});

router.get('/register', (req, res) => {
    res.render('REGISTER');
});

router.get('/login', (req, res) => {
    res.render('LOGIN');
});

router.get("/profile", authController.isLoggedIn, (req, res) => {
    if (req.user) {
      res.render("PROFILE", { user: req.user });
    } else {
      res.redirect("/login");
    }
});

module.exports = router;
