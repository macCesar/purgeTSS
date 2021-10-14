// ./purgetss/config.js
module.exports = {
	purge: {
		mode: 'all',

		// These options are passed through directly to PurgeTSS
		options: {
			safelist: [],
		}
	},
	theme: {
		extend: {}
	},
	corePlugins: {}
};
