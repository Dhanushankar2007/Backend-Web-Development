
const COOKIE_NAME = 'sid';
const ttlMs = Number(process.env.SESSION_TTL_MS || 60 * 60 * 1000);
function cookieOptions() {
return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    signed: true,
    path: '/',
    maxAge: ttlMs,
};
}
function clearCookieOptions() {
    const { maxAge, ...options } = cookieOptions();
    return options; // same scope, no maxAge
}
module.exports = { COOKIE_NAME, ttlMs, cookieOptions, clearCookieOptions };