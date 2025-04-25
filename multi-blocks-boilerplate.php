<?php
/**
 * Plugin Name:       Multi Blocks Boilerplate
 * Description:       A boilerplate for creating multiple blocks in WordPress.
 * Version:           1.0.0
 * Requires at least: 6.4
 * Requires PHP:      8.1
 * Author:            NicoMarcico
 * Author URI:        https://github.com/NicoMarcico
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       multi-blocks-boilerplate
 *
 * @package MultiBlocksBoilerplate
 */

namespace MultiBlocksBoilerplate;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registering blocks automatically from the build/blocks/ directory.
 *
 * @return void
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function register_blocks() {
	$blocks_dir = plugin_dir_path( __FILE__ ) . 'build/blocks/';

	// Check if the directory exists.
	if ( ! is_dir( $blocks_dir ) ) {
		return;
	}

	// Retrieve all block folders.
	$block_folders = glob( $blocks_dir . '*', GLOB_ONLYDIR );

	// Loop through each block folder and register the block.
	foreach ( $block_folders as $block_folder ) {
		register_block_type( $block_folder );
	}
}
add_action( 'init', __NAMESPACE__ . '\register_blocks' );
