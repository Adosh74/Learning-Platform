/* eslint-disable */
module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],
	overrides: [],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'prettier'],
	rules: {
		'prettier/prettier': ['warn', { endOfLine: 'auto' }],
		'no-var': 'error',
	},
};
