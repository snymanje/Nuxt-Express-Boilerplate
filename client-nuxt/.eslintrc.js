module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
    extends: [
        '@nuxtjs',
        'prettier',
        'prettier/vue',
        'plugin:prettier/recommended',
        'plugin:nuxt/recommended',
    ],
    plugins: ['prettier'],
    // add your custom rules here
    rules: {
        'prettier/prettier': 'error',
        'no-unused-vars': 'warn',
        'no-console': 'warn',
        'no-process-exit': 'off',
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'no-underscore-dangle': ['error', { allow: ['_id'] }],
        'func-names': 'off',
        'class-methods-use-this': 'warn',
        'node/no-unpublished-require': 'off',
        'consistent-return': 'off',
        'node/no-extraneous-require': 'off',
    },
}