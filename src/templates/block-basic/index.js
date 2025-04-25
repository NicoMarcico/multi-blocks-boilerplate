/**
 * Dependencies
 */
const { join } = require('path');
/**
 * Plugin configuration file.
 * The one to change to your plugin and blocks needs,
 * before generating the files.
 *
 * Note:
 * If You used the setup-plugin.js script, the pluginConfig file is already updated with your values.
 */
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
		description: `Standard block generated with the ${pluginConfig.pluginName}.`,
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
