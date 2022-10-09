/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
	cacheDirectory: './node_modules/.cache/remix',
	ignoredRouteFiles: ['**/.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}'],
	// When running locally in development mode, we use the built in remix
	// server. For the prod build, we want remix bundled as a sidecar for tauri.
	// Note: temporarily disabled until remix figures itself out
	// server: process.env.NODE_ENV === 'development' ? undefined : './server.js',
};
