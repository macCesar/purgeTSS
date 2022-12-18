// ./purgetss/config.js
module.exports = {
	purge: {
		mode: 'all',
		method: 'sync', // set how to execute auto-purging: sync or async

		// These options are passed directly to PurgeTSS
		options: {
			legacy: false, // Generates & Purge tailwind.tss v5.x classes
			missing: true, // Report missing classes
			widgets: false, // Purge widgets too
			safelist: [], // Array of classes to keep
			plugins: [] // Array of properties to ignore
		}
	},
	theme: {
		extend: {}
	}
};
