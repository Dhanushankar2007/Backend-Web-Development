// TODO: implement create/get/destroy around an in-memory Map.
// Store opaque session id -> { userId, expiresAt }, never credentials.
// Remove expired sessions during reads.
// module.exports = {};
const { randomUUID } = require('crypto');
const { ttlMs } = require('./cookieConfig');
const sessions = new Map(); // one module-level store
function create(userId) {
const id = randomUUID(); // cryptographically unpredictable
const session = { userId, expiresAt: Date.now() + ttlMs };
sessions.set(id, session);
return { id, ...session };
}
function get(id) {
if (!id) return null;
const session = sessions.get(id);
if (!session) return null;
if (session.expiresAt <= Date.now()) { // server-side expiry
sessions.delete(id);
return null;
}
return session;
}
function destroy(id) {
if (id) sessions.delete(id); // safe when missing
}
module.exports = { create, get, destroy };
