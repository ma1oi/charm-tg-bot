// @ts-check

import eslint from '@eslint/js';
import importSort from 'eslint-plugin-simple-import-sort';
import importPlugin from 'eslint-plugin-import';

import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config({
	extends: [
		eslint.configs.recommended,
		tseslint.configs.recommendedTypeChecked,
		tseslint.configs.stylisticTypeChecked,
	],
	plugins: {
		import: importPlugin,
		'simple-import-sort': importSort,
	},
	files: ['**/*.ts', '**/*.test.ts'],
	ignores: ['**/_api-spec.ts'],
	languageOptions: {
		ecmaVersion: 2022,
		globals: globals.node,
		parserOptions: {
			project: ['./tsconfig.json'],
			tsconfigRootDir: '.',
		},
	},
	rules: {
		'simple-import-sort/imports': [
			'error',
			{
				groups: [
					['^@?\\w'],
					['^#\\w'],
					['^\\.\\.(?!/?$)', '^\\.\\./?$'],
					['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
				],
			},
		],
		'simple-import-sort/exports': 'error',
		'import/first': 'error',
		'import/newline-after-import': 'error',
		'import/no-duplicates': 'error',
		'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
		'@typescript-eslint/no-empty-object-type': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
	},
});
