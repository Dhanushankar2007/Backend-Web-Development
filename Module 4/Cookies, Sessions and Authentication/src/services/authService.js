const bcrypt = require('bcryptjs');
const AppError = require('../errors/AppError');
const userRepository = require('../repositories/userRepository');
const requiredString = (v) => typeof v === 'string' && v.trim().length > 0;
const invalidCredentials = () =>
new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });

async function verifyCredentials(input = {}) {
if (!requiredString(input.email) || !requiredString(input.password)) {
throw new AppError(400, 'INVALID_INPUT', 'Email and password are required');
}
const user = await userRepository.findByEmail(
input.email.trim().toLowerCase()
);
if (!user) throw invalidCredentials();
if (!(await bcrypt.compare(input.password, user.passwordHash))) {
throw invalidCredentials(); // identical to the unknown-email case
}
return publicUser(user);
}
module.exports = { verifyCredentials };