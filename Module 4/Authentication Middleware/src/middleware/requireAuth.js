
const jwt = require('jsonwebtoken');

// TODO: Implement requireAuth middleware.
module.exports = function requireAuth(req, res, next) {
  // TODO 1: Read the Authorization header.
  const authHeader = req.headers.authorization ?? '';

  // TODO 2: Extract the Bearer token using the strict regex.
  const match = authHeader.match(/^Bearer ([^\s]+)$/i);
  const token = match ? match[1] : null;

  // TODO 3: Return 401 if the token is missing or malformed.
  if (token === null) {
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required'
      }
    });
  }

  try {
    // TODO 4: Verify the token using HS256 only.
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    );

    // TODO 5: Attach the verified payload and continue.
    req.user = payload;
    return next();
  } catch (error) {
    // TODO 6: Return the same generic 401 response for every error.
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required'
      }
    });
  }
};
