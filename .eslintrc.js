module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "jquery": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:es5/no-es2015"
    ],
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {
        "no-unused-vars": 0
    },
    "plugins": [
        "es5"
    ]
};
