/**
 * Simple API Key authentication middleware.
 * Validates the X-API-KEY header against the API_KEY environment variable.
 */
function apiKeyAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  const validKey = process.env.API_KEY;

  if (!validKey) {
    // If no API_KEY is set in env, skip validation (development mode)
    return next();
  }

  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({ error: "Unauthorized: Invalid or missing API key" });
  }

  next();
}

module.exports = apiKeyAuth;
