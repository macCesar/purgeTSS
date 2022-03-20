// ./purgetss/config.js
module.exports = {
	purge: {
		mode: 'all',

		// These options are passed through directly to PurgeTSS
		options: {
			widgets: false, // Purge widgets
			missing: false, // Report missing classes
			safelist: [] // Array of classes to keep
		}
	},
	theme: {
		extend: {}
	},
	corePlugins: {}
};
