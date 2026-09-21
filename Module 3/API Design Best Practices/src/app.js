//app.js

const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');
const http = require('./utils/http');
const ApiError = require('./utils/apiError');

function createApp() {
  const app = express();
  app.use(express.json());

  // app.use('/', postRoutes);
  app.use('/api/posts', postRoutes);

  // app.get('/explode', controller.explode);

  // TODO:
  // - make public contract resource-oriented
  // - standardise success envelope
  // - standardise error envelope
  // - add pagination metadata on list route
  // - cap limit server-side (default limit = 2 for exercise)
  // - stop exposing old verb routes as public contract
  // - expose safe internal failure route for testing/demo
  
  // Internal-failure simulation kept out of the public resource contract.
  app.get('/api/debug/internal-failure', controller.triggerInternalFailure);

  // Unknown route -> same error envelope as everything else.
  app.use((req, res) => {
    return http.sendError(
      res,
      404,
      'ROUTE_NOT_FOUND',
      `No route matches ${req.method} ${req.originalUrl}.`
    );
  });

  // Central error handler. Nothing below this leaks internals.
  app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
      return http.sendError(res, err.status, err.code, err.message, err.details);
    }

    console.error('[internal-error]', err);

    return http.sendError(
      res,
      500,
      'INTERNAL_ERROR',
      'An unexpected error occurred. Please retry, and contact support if it persists.'
    );
  });


  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = 3000;
  app.listen(port, () => {
    console.log(`Starter API listening on port ${port}`);
  });
}

module.exports = {
  createApp,
  resetData
};