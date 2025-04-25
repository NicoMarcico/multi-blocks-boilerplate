#!/usr/bin/env node

/**
 * Script for setting up the plugin configuration.
 *
 * It gathers user input for various plugin settings, then:
 *  - updates the main PHP file header
 *  - renames the main PHP file
 *  - updates the plugin configuration file
 *  - updates phpcs.xml.dist
 *
 * The script can be run from anywhere in the project.
 *
 * Usage:
 * npm run setup-plugin
 *
 * Note: This script should be run right after the plugin creation,
 * before any other operations, to ensure the plugin is correctly configured.
 * It will not overwrite existing files, but it will update the content.
 */

/**
 * Dependencies
 */
const fs = require('fs');
const path = require('path');
const { input } = require('@inquirer/prompts');
const prettier = require('prettier');
const wpPrettierConfig = require('@wordpress/prettier-config');
const pluginConfig = require('./plugin.config');
const {
	isKebabCase,
	slugToTitle,
	slugToPascalCase,
	getFilePath,
} = require('./utils');

// Plugin configuration file path
const pluginConfigPath = path.resolve(__dirname, './plugin.config.js');
// phpcs configuration file path
const phpcsPath = path.resolve(__dirname, '../phpcs.xml.dist');
// Current main PHP file path
const currentPhpFilePath = getFilePath(pluginConfig.textdomain);

/**
 * Gathers user input via prompts.
 *
 * @returns {Promise<object>} The gathered input values.
 */
const gatherInput = async () => {
	console.log('\n🛠️  Plugin configuration setup\n');

	// Common variables for plugin and blocks
	console.log('1/3 - Common variables for plugin and blocks');
	const textdomain = await input({
		message: 'Plugin textdomain (also used as slug):',
		default: 'awsome-plugin',
		required: true,
		validate: (value) => {
			if (!isKebabCase(value)) {
				return 'The textdomain must be in kebab-case (e.g., my-awsome-plugin)';
			} else {
				return true;
			}
		},
	});
	const pluginName = await input({
		message: 'Plugin Name:',
		default: slugToTitle(textdomain),
		required: true,
	});
	const phpNamespace = await input({
		message: 'PHP Namespace:',
		default: slugToPascalCase(textdomain),
		required: true,
	});

	// Plugin specific variables
	console.log('\n2/3 - Plugin specific variables');
	const pluginDescription = await input({
		message: 'Plugin Description:',
		default: '',
	});
	const pluginVersion = await input({
		message: 'Plugin Version:',
		default: '0.1.0',
	});
	const wpVersion = await input({
		message: 'Minimum WordPress version required:',
		default: '6.4',
	});
	const phpVersion = await input({
		message: 'Minimum PHP version required:',
		default: '8.1',
	});
	const author = await input({
		message: 'Author Name:',
	});
	const authorUri = await input({
		message: 'Author URI:',
	});
	const license = await input({
		message: 'License:',
		default: 'GPL-2.0-or-later',
	});
	const licenseUri = await input({
		message: 'License URI:',
		default: 'https://www.gnu.org/licenses/gpl-2.0.html',
	});

	// Blocks specific variables
	console.log('\n3/3 - Blocks specific variables');
	const $schema = await input({
		message: 'JSON Schema for reference:',
		default: 'https://schemas.wp.org/trunk/block.json',
	});
	const blocksNamespace = await input({
		message: 'Blocks Namespace (for Gutenberg identification):',
		default: textdomain,
	});
	const apiVersion = await input({
		message: 'Blocks API Version:',
		default: 3,
	});
	const version = await input({
		message: 'Blocks version:',
		default: '0.1.0',
	});

	return {
		textdomain,
		pluginName,
		phpNamespace,
		pluginDescription,
		pluginVersion,
		wpVersion,
		phpVersion,
		author,
		authorUri,
		license,
		licenseUri,
		$schema,
		blocksNamespace,
		apiVersion,
		version,
	};
};

/**
 * Updates the main PHP file header.
 *
 * @param {object} config The new configuration values.
 */
const updateMainPhpFile = async (config) => {
	// Reading actual content of the PHP file
	const fileContent = fs.readFileSync(currentPhpFilePath, 'utf8');

	// Building the new header
	const headerLines = [
		'/**',
		config.pluginName && ` * Plugin Name:       ${config.pluginName}`,
		config.pluginDescription &&
			` * Description:       ${config.pluginDescription}`,
		config.pluginVersion && ` * Version:           ${config.pluginVersion}`,
		config.wpVersion && ` * Requires at least: ${config.wpVersion}`,
		config.phpVersion && ` * Requires PHP:      ${config.phpVersion}`,
		config.author && ` * Author:            ${config.author}`,
		config.authorUri && ` * Author URI:        ${config.authorUri}`,
		config.license && ` * License:           ${config.license}`,
		config.licenseUri && ` * License URI:       ${config.licenseUri}`,
		config.textdomain && ` * Text Domain:       ${config.textdomain}`,
		config.phpNamespace && ` *`,
		config.phpNamespace && ` * @package ${config.phpNamespace}`,
		' */',
	];

	// Filter empty elements (undefined or null) and join lines with a break
	const newHeader = headerLines.filter(Boolean).join('\n');

	// Replace the comments (/** ... */)
	let updatedContent = fileContent.replace(/\/\*\*[\s\S]*?\*\//, newHeader);

	// Replace the namespace declaration.
	// We manage the namespace line independently from the comments
	// to keep the line break between them.
	if (config.phpNamespace) {
		updatedContent = updatedContent.replace(
			/namespace\s+[^\s;]+;/,
			`namespace ${config.phpNamespace};`
		);
	}

	// If the file exists, we write the updated content to it
	if (fs.existsSync(currentPhpFilePath)) {
		fs.writeFileSync(currentPhpFilePath, updatedContent);
		console.log('\n✅ Main PHP file header has been updated.');
	} else {
		console.warn(`\n⚠️  Could not find ${currentPhpFilePath} to update.`);
	}
};

/**
 * Renames the main PHP file.
 *
 * @param {object} config The new configuration values.
 */
const renameMainPhpFile = async (config) => {
	const newPhpFilePath = getFilePath(config.textdomain);

	if (fs.existsSync(currentPhpFilePath)) {
		fs.renameSync(currentPhpFilePath, newPhpFilePath);
		console.log(
			`✅ Main PHP file has been renamed to: ${config.textdomain}.php`
		);
		return pluginConfig.textdomain;
	} else {
		console.warn(`\n⚠️  Could not find ${currentPhpFilePath} to rename.`);
	}
};

/**
 * Updates the plugin configuration file.
 *
 * @param {object} config The new configuration values.
 */
const updateConfigFile = async (config) => {
	// Reading the actual content of the plugin configuration file
	const pluginConfigContent = fs.readFileSync(pluginConfigPath, 'utf8');
	const pluginConfigLines = [
		'module.exports = {',
		`  pluginName: '${config.pluginName}',`,
		`  phpNamespace: '${config.phpNamespace}',`,
		`  textdomain: '${config.textdomain}',`,
		`  $schema: '${config.$schema}',`,
		`  apiVersion: ${config.apiVersion},`,
		`  version: '${config.version}',`,
		`  blocksNamespace: '${config.blocksNamespace}',`,
		'};',
	];

	// Format with prettier using WP config and join lines with a break
	const newPluginConfig = await prettier.format(
		pluginConfigLines.join('\n'),
		{
			...wpPrettierConfig,
			parser: 'babel',
		}
	);

	// Replace the plugin configuration
	const updatedConfigContent = pluginConfigContent.replace(
		/module\.exports\s*=\s*\{[\s\S]*?\};/,
		newPluginConfig
	);

	// Write the updated content to the file
	fs.writeFileSync(pluginConfigPath, updatedConfigContent);
	console.log('✅ plugin.config.js has been updated.');
};

/**
 * Updates the phpcs.xml.dist file
 * by modifying the textdomain property.
 *
 * @param {object} config The new configuration values.
 */
const updatePhpcsFile = async (config) => {
	// Reading the actual content of the phpcs file
	const phpcsContent = fs.readFileSync(phpcsPath, 'utf8');

	// Replace the textdomain in the phpcs file
	const updatedPhpcsContent = phpcsContent.replace(
		/(<property name="text_domain"[^>]*>\s*<!--.*?-->\s*<element value=")[^"]*("\/>)/,
		`$1${config.textdomain}$2`
	);

	// Write the updated content to the file
	fs.writeFileSync(phpcsPath, updatedPhpcsContent);
	console.log('✅ phpcs.xml.dist has been updated.');
};

/**
 * Main function to run the setup
 */
(async () => {
	try {
		const userInput = await gatherInput();
		await updateMainPhpFile(userInput);
		await renameMainPhpFile(userInput);
		await updateConfigFile(userInput);
		await updatePhpcsFile(userInput);
		console.log('\n✨ Done!');
	} catch (error) {
		console.error('Error during plugin setup:', error);
	}
})();
