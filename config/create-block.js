#!/usr/bin/env node

/**
 * Script for creating a new block using the @wordpress/create-block package.
 *
 * It validates the block name, checks for existing templates, gathers arguments
 * and runs the create-block command with them.
 *
 * The script can be run with additional options for customization.
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/#options
 *
 * It also can be run from anywhere in the project.
 *
 * Usage with the help of package.json scripts:
 * npm run create-block -- <block-name> [--option1 value1] [--option2 value2]...
 *
 * Usage with templates located in ./src/templates (e.g., ./src/templates/template-name):
 * npm run create-block -- <block-name> --template template-name [--option2 value2]...
 *
 * Note: To use a template in a package.json script, we need to use environment variables.
 * Example:
 * "create-block-foo": "cross-env BLOCK_TEMPLATE=template-name node config/create-block.js",
 *
 * This is due to the fact that the script is run in a different context than the package.json script.
 * That's also why we need to use "--" to separate the script name from the arguments in cli.
 */

/**
 * Dependencies
 */
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { isKebabCase, getRelativePath } = require('./utils');

// Parse arguments
const args = process.argv.slice(2);
const blockNameIndex = args.findIndex((arg) => !arg.startsWith('--'));
const blockName = args[blockNameIndex];

if (!blockName) {
	console.error('❌ You must specify a block name');
	process.exit(1);
}

// Validate block name (kebab-case: lowercase letters, numbers, hyphens only)
if (!isKebabCase(blockName)) {
	console.error(
		'❌ Block name must be in kebab-case (e.g., my-custom-block)'
	);
	process.exit(1);
}

// Parse options
const filteredOptions = args.slice(blockNameIndex + 1);

// Check for existing template argument
let templateType = process.env.BLOCK_TEMPLATE || '';

for (let i = 0; i < filteredOptions.length; i++) {
	if (filteredOptions[i] === '--template' && filteredOptions[i + 1]) {
		templateType = filteredOptions[i + 1];
		break;
	}
}

// Retrieve the template directory absolute path
const targetDirPath = path.resolve(__dirname, `../src/blocks/${blockName}`);
// Convert absolute path to relative path for @wordpress/create-block
const targetDirRel = getRelativePath(targetDirPath);

// Build create-block args
const createBlockArgs = [
	'@wordpress/create-block',
	blockName,
	'--no-plugin',
	`--target-dir=${targetDirRel}`,
	...filteredOptions,
];

// Add template argument if specified
if (templateType) {
	// Resolve template path
	const templateDirPath = path.resolve(
		__dirname,
		`../src/templates/${templateType}`
	);

	// Check template existence
	if (!fs.existsSync(templateDirPath)) {
		console.error(`❌ The template "${templateDirPath}" does not exist.`);
		process.exit(1);
	}

	// Convert absolute path to relative path for @wordpress/create-block
	const templateDirRel = getRelativePath(templateDirPath);

	// Add template argument
	createBlockArgs.push(`--template=${templateDirRel}`);
}

// Run @wordpress/create-block with the specified arguments
const result = spawnSync('npx', createBlockArgs, {
	stdio: 'inherit',
});

if (result.error || result.status !== 0) {
	console.error('❌ Block creation failed.');

	if (result.error) {
		console.error('❌ Error:', result.error.message);
	}

	process.exit(1);
}

// Success message
console.log('');
console.log(
	`✅ Block "${blockName}" created successfully at src/blocks/${blockName}`
);
if (templateType) {
	console.log(`📦 Using template: ${templateType}`);
}
console.log('');
