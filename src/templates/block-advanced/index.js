/**
 * Template configuration file.
 * It uses common blocks variables from the plugin.config.js file.
 *
 * Note:
 * If You used the setup-plugin.js script,
 * the plugin.config.js file is already updated with your values.
 */

/**
 * Dependencies
 */
const { join } = require('path');
const pluginConfig = require('../../../config/plugin.config');

module.exports = {
	defaultValues: {
		$schema: pluginConfig.$schema,
		apiVersion: pluginConfig.apiVersion,
		version: pluginConfig.version,
		namespace: pluginConfig.blocksNamespace, // Blocks namespace for Gutenberg identification

		// Custom variables, also available in the Mustache template files
		transformer: (view) => {
			return {
				...view,
				pluginNamespace: pluginConfig.phpNamespace, // PHP namespace used in main php files
			};
		},

		textdomain: pluginConfig.textdomain,
		dashicon: 'smiley',
		description: `Advanced block generated with the ${pluginConfig.pluginName}.`,
		example: {},
		supports: {
			html: false,
		},
		attributes: {},
		viewScript: 'file:./view.js',
	},
	variants: {
		static: {},
		dynamic: {
			render: 'file:./render.php',
		},
	},
	blockTemplatesPath: join(__dirname, 'files'),
};
