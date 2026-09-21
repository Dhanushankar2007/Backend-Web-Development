// function sendList(res, rows) {
//   return res.status(200).json(rows);
// }

// function sendCreated(res, post) {
//   return res.status(200).json({ post });
// }

// function sendOk(res, payload) {
//   return res.status(200).json(payload);
// }

// function sendError(res, status, payload) {
//   return res.status(status).json(payload);
// }

// module.exports = {
//   sendList,
//   sendCreated,
//   sendOk,
//   sendError
// };

//http.js

function sendSuccess(res, status, data, meta) {
  const body = { success: true, data };
  if (meta !== undefined) body.meta = meta;
  return res.status(status).json(body);
}

function sendError(res, status, code, message, details) {
  const error = { code, message };
  if (details !== undefined) error.details = details;
  return res.status(status).json({ success: false, error });
}

module.exports = {
  sendSuccess,
  sendError
};
