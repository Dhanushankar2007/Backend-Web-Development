// TODO: read req.signedCookies.sid, resolve the server session,
// attach identity to the request, and return generic 401 when invalid.
// module.exports = function requireSession(req, res, next) {
//   next();
// };
const AppError = require('../errors/AppError');
const sessionStore = require('../session/sessionStore');
const userRepository = require('../repositories/userRepository');
const { COOKIE_NAME } = require('../session/cookieConfig');
const authRequired = () =>
new AppError(401, 'AUTH_REQUIRED', 'Authentication required');
async function requireSession(req, res, next) {
try {
const sessionId = req.signedCookies[COOKIE_NAME]; // NOT req.cookies
const session = sessionId && sessionStore.get(sessionId);
if (!session) throw authRequired();
const user = await userRepository.findPublicById(session.userId);
if (!user) {
sessionStore.destroy(sessionId); // clean up orphaned session
throw authRequired();
}
req.sessionId = sessionId;
req.user = user;
next();
} catch (err) {
next(err);
}
}
module.exports = requireSession;
