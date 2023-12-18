module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  //   校宴規則
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'pref',
        'test',
        'chore',
        'revert',
        'build',
      ],
    ],
    'type-case': [0],
    'type-empty': [0],
    // 'type-empty': [2, 'never'],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [2, 'always', 108],
    // 'body-leading-blank': [2, 'always'],
    // 'footer-leading-blank': [1, 'always'],
    // 'subject-empty': [2, 'never'],
  },
}
