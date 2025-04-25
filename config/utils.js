/**
 * Dependencies
 */
const path = require('path');

/**
 * Checks if a string is in kebab-case.
 *
 * @param {string} str String to check
 * @returns {boolean} True if the string is in kebab-case
 */
function isKebabCase(str) {
	return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
}

/**
 * Generates spaced PascalCase from slug.
 *
 * @param {string} slug
 * @returns {string} Pascal Case
 */
function slugToTitle(slug) {
	return slug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

/**
 * Generates PascalCase from slug.
 *
 * @param {string} slug
 * @returns {string} PascalCase
 */
function slugToPascalCase(slug) {
	return slug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');
}

/**
 * Returns the path to a file from a name.
 *
 * @param {string} name Base name of the file (e.g. textdomain, slug)
 * @param {string} dir Parent directory (default one upper directory)
 * @param {string} ext File extension (default php)
 * @returns {string} Complete path to the file
 */
function getFilePath(name, dir = path.join(__dirname, '../'), ext = 'php') {
	return path.join(dir, `${name}.${ext}`);
}

/**
 * Returns a relative path from a given path.
 * Commonly used to convert absolute paths to relative paths.
 *
 * @param {string} basePath Base path to resolve
 * @returns {string} Relative path from the current working directory
 */
function getRelativePath(basePath) {
	return path.relative(process.cwd(), basePath);
}

module.exports = {
	isKebabCase,
	slugToTitle,
	slugToPascalCase,
	getFilePath,
	getRelativePath,
};
