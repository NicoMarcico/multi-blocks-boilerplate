# Multi Blocks Boilerplate

A modern and modular boilerplate for building multiple Gutenberg blocks in one WordPress plugin.  
Designed to provide an easy starting point for developers building multiple custom blocks using Gutenberg.

## 🎯 Objectives

- Provide a solid foundation for creating multiple custom Gutenberg blocks.
- Adopt modern WordPress development best practices.
- Integrate a modern build workflow.
- Ensure compliance with WordPress coding standards (PHP, JS, CSS).
- Facilitate scalability and customization for developers.

> ℹ️ **Note**  
> This boilerplate is focused on block development.  
> It is intended to help you get started quickly with creating custom Gutenberg blocks for your WordPress plugins.

## ✨ Features

- **Modular block structure**: Supports multiple blocks within a single plugin, each with its own folder.
- **Customization**: Setup the plugin config with the help of interactive CLI prompts.
- **Time-saving**: Create-block script can be run from any location in the project, not only root.
- **Template support**: Use local custom templates to scaffold your blocks.
- **Internationalization ready**: follows best practices for textdomains.
- **Modern build tools**: blocks bundled with `@wordpress/scripts`.
- **Automated code quality tools**:
  - PHP: [PHP_CodeSniffer](https://github.com/PHPCSStandards/PHP_CodeSniffer/) with [WordPress Coding Standards](https://github.com/WordPress/WordPress-Coding-Standards).
  - JS/CSS: ESLint via `@wordpress/scripts` and [Prettier](https://prettier.io/).
- **Developer-friendly configuration**:
  - `./config/` folder with configuration and utility scripts.
  - `.editorconfig` for consistent coding styles.
  - `.prettierrc` for Prettier configuration.
  - `phpcs.xml.dist` for PHP_CodeSniffer rules.
  - `package.json` including block creation scripts

## 🚀 Prerequisites

To use this boilerplate, ensure you have the following installed:

- **PHP** v8.1+.
- **WordPress** v6.4+.
- **Node.js** v18+ (LTS).
- **npm/yarn** For managing JavaScript dependencies.
- **Composer** For managing PHP dependencies.

## ⚙️ Setup and blocks creation

You can make this plugin yours easily.  
It is intended to simplify block development in a WordPress project.

To help you, 2 important parts are managed:

1. The plugin configuration setup
2. The blocks creation

### Setup

Following WordPress standards, you can deploy a plugin in which name, textdomain/slug and namespace are aligned.

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/multi-blocks-boilerplate.git your-plugin-name
cd your-plugin-name
npm install         # Install node dependencies
composer install    # Install PHP dependencies
```

Setup the plugin configuration to your needs:

```bash
npm run setup-plugin
```

Just answer the prompts about the plugin configuration.

They are dived in 3 parts:

1. Common variables for plugin and blocks
2. Plugin specific variables
3. Blocks specific variables

> ℹ️ **Note**  
> From the first prompt, the **textdomain/slug** one, default values are provided for:  
> -> **Plugin name**  
> -> **PHP namespace**  
> -> **Blocks namespace**  
> According to PHP and WP standards

With your input values, the `./config/setup-plugin.js` script does the following:

- Updates the main PHP file header
- Renames the main PHP file
- Updates the plugin configuration file
- Updates phpcs.xml.dist

And that's it ! You can start developing blocks 😉.

### Blocks creation

When developing blocks in the WordPress ecosystem, things can sometimes be redundant, time-consuming and lead to frustration.

#### The base

This plugin ads an overlay on the @wordpress/create-block tool to help you spend less time in the blocks configuration.

The script `./config/create-block.js` validates the block name, checks for existing local template, gather your arguments and finaly runs the create-block command with them.  

To call this script you can use `./package.json` ones:

```bash
# Using @wordpress/create-bloc default template
npm run create-block -- <block-name> [--option1 value1] [--option2 value2]...

# Using a template located in ./src/templates (e.g., ./src/templates/template-name)
npm run create-block -- <block-name> --template template-name [--option2 value2]...
```

> ℹ️ **Note**  
> Those scripts can be **run from anywhere inside the project**, saving your time 😉.  
> WP [**create-block options**](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/#options) can be passed as flags, **they overwrite templates ones** if already present.  
> The `--no-plugin` one is already passed by the script in order to only generate blocks.

A `./src/blocks/block-created` folder is created with the block files in it.

#### Templates

2 templates are already present, for use and inspiration.  
The templates use variables stored in the `./config/plugin.config.js` configuration file.  
They are modifyed by the `./config/setup-plugin.js script`.

`block-basic` is quite similar to @wordpress/create-block one, with less comments for a better reading.  
`block-advanced` is a factored one, including seperated files for the toolbar, settings and block itself.

For both, the `--dynamic` flag is interpreted and files are accordingly generated.

Usage:

```bash
# Basic template, default static mode and flags
npm run create-block-basic -- great-block --title "A real great block" --category media

# Advanced template, dynamic mode
npm run create-block-adv -- more-great-block --dynamic
```

If you modify the `./src/templates` folder path, don't forget to modify the `./config/create-block.js` script accordingly.

> ⚠️ **Warning**  
> To use a **template in a package.json script**, we need to use **environment variables**.  
> This is due to the fact that the script is run in a different context than the package.json script.  
> That's also why **we need to use "--" to separate the script name from the arguments in cli**.

## 🛠 Watch, build and lint

### Watch and Build

The watch and build processes use the **@wordpress/scripts** package.  
Under the hood, Webpack is configured with Babel and ESLint.  
**JSX** and **SCSS** are respectively transpiled into **JS** and **CSS** during watch and build processes.

```bash
npm run start   # Watch for changes to ./src files, automatically rebuild them in ./build.
npm run build   # Build ./src files in the ./build folder for deployment.
```

### Lint

This boilerplate follows WordPress coding standards. Use the following commands to check and fix code:

```bash
composer phpcs  # Check the code against coding standards
composer phpcbf # Automatically fix fixable errors
```

For JS and SCSS files, the WordPress Prettier configuration is included via the .prettierrc file.

## 📁 Project Structure

```bash
├── build/                # Bundled blocks after build
├── config/               # Plugin and blocks configuration
    ├── create-block.js   # Block creation script
    ├── plugin.config.js  # Configuration file with variables
    ├── setup-plugin.js   # Plugin configuration setup script
    ├── utils.js          # Reusable functions
├── src/                  # Source files
    ├── blocks/           # Blocks folders (e.g., block1, block2)
    ├── templates/        # Templates for block creation
```

## 📚 License

This project is licensed under the GPLv2 or later license.  
You are free to use, modify, and distribute it under the same license.

## 🙏 Credits & Inspirations

This project is inspired and informed by the following resources:

- [WordPress Developer Handbook](https://developer.wordpress.org/) — Official documentation for WordPress theme and block development.
- [@wordpress/scripts](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/) — Simplifies configuration of modern build tools for WordPress development.
- [WordPress Coding Standards](https://github.com/WordPress/WordPress-Coding-Standards) — PHP_CodeSniffer ruleset for WordPress code quality.
- [@wordpress/create-block](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/) — WordPress tool for plugin and blocks creation.
- [External Project Templates](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/packages-create-block-external-template/) — Templating in block creation.
