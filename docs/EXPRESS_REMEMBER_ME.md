# Express Remember-Me Token Store

## Schema changes
- A new `remember_tokens` table is created automatically on startup by `backend/express/src/config/db.js`. The table links a hashed remember-me token to a user ID and expiry timestamp.
- Deployments using an existing SQLite file should run the Express API once after deploying this change so the table is created before traffic arrives. No destructive migration is required.

## Configuration
- New environment variables are available for the Express API:
  - `REMEMBER_TOKEN_EXPIRY` (default `30d`): duration before remember-me tokens expire and are rotated.
  - `REMEMBER_ME_COOKIE_NAME` (default `rememberMe`): cookie name issued to browsers for remember-me tokens.
- Ensure production deployments keep `REMEMBER_ME_COOKIE_NAME` aligned with any existing cookie configuration (e.g., CDN rewrites) and that HTTPS is enforced because the cookie is sent with `secure: true`.

## Operational notes
- The login endpoint issues the remember-me cookie only when the client requests `rememberMe: true`. Clearing the cookie requires the logout endpoint to be called, which also removes the stored token hash.
- Middleware now validates and rotates remember-me tokens on every request, so deployments should monitor for increased write activity to the SQLite database. Consider vacuuming the database if a large number of remembered sessions accumulate.
