const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
router.post('/register', async (req, res, next) => {
try {
const { name, email, password } = req.body || {};
const user = await authService.register(
name,
email,
password
);
return res.status(201).json(user);
} catch (error) {
return next(error);
}

});
router.post('/login', async (req, res, next) => {
try {
const { email, password } = req.body || {};
const user = await authService.login(email, password);
return res.status(200).json(user);
} catch (error) {
return next(error);
}
});
module.exports = router;
