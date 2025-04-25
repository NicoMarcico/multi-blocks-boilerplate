/**
 * Plugin configuration variables used in block generation.
 *
 * The values are used in the ./src/templates/ to generate the files.
 *
 * phpNamespace is the PHP namespace used in the main PHP files.
 * blocksNamespace is the internal blocks namespace, used for all blocks.
 *
 * After the generations, you can of course modify the files as you wish.
 * Just be aware of the textdomain consistancy for translation purpose.
 */

module.exports = {
	pluginName: 'Multi Blocks Boilerplate',
	phpNamespace: 'MultiBlocksBoilerplate',
	textdomain: 'multi-blocks-boilerplate',
	$schema: 'https://schemas.wp.org/trunk/block.json',
	apiVersion: 3,
	version: '0.1.0',
	blocksNamespace: 'multi-blocks-boilerplate',
};
