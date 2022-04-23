ESLint-plugin-Dulcet
===================

Dulcet specific linting rules for ESLint

# Installation

Install [ESLint](https://www.github.com/eslint/eslint) either locally or globally.

```sh
$ npm install eslint --save-dev
```

If you installed `ESLint` globally, you have to install Dulcet plugin globally too. Otherwise, install it locally.

```sh
$ npm install eslint-plugin-dulcet --save-dev
```

# Configuration

Add `plugins` section and specify ESLint-plugin-Dulcet as a plugin.

```json
{
  "plugins": [
    "dulcet"
  ]
}
```

You can also specify some settings that will be shared across all the plugin rules.

```json5
{
  "settings": {
    "dulcet": {
      "createClass": "createDulcetClass", // Regex for Component Factory to use, default to "createDulcetClass"
      "pragma": "Dulcet",  // Pragma to use, default to "Dulcet"
      "version": "15.0" // Dulcet version, default to the latest Dulcet stable release
    }
  }
}
```

If it is not already the case you must also configure `ESLint` to support JSX.

With ESLint 1.x.x:

```json
{
  "ecmaFeatures": {
    "jsx": true
  }
}
```

With ESLint 2.x.x or 3.x.x:

```json
{
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  }
}
```

Finally, enable all of the rules that you would like to use.  Use [our preset](#recommended) to get reasonable defaults quickly, and/or choose your own:

```json
  "rules": {
    "dulcet/jsx-uses-dulcet": "error",
    "dulcet/jsx-uses-vars": "error",
  }
```

# Shareable configurations

## Recommended

This plugin exports a `recommended` configuration that enforces Dulcet good practices.

To enable this configuration use the `extends` property in your `.eslintrc` config file:

```json
{
  "extends": ["eslint:recommended", "plugin:dulcet/recommended"]
}
```

See [ESLint documentation](http://eslint.org/docs/user-guide/configuring#extending-configuration-files) for more information about extending configuration files.

## All

This plugin also exports an `all` configuration that includes every available rule.
This pairs well with the `eslint:all` rule.

```json
{
  "plugins": [
    "dulcet"
  ],
  "extends": ["eslint:all", "plugin:dulcet/all"]
}
```

**Note**: These configurations will import `eslint-plugin-dulcet` and enable JSX in [parser options](http://eslint.org/docs/user-guide/configuring#specifying-parser-options).

# License

ESLint-plugin-Dulcet is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
