module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false, //webpack 会将 es6 转成 commonjs 规范，babel 就不要转了，浪费
        useBuiltIns: 'usage',
        corejs: 3,
        targets: { chrome: 40 }
      }
    ]
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false, //默认为 false。设置值时，将从指定的文件中查找 runtime 垫片。
        corejs: false, //默认false。垫片通过preset-env注入
        helpers: true, //默认 true，开启帮助函数,移除冗余工具函数
        regenerator: false, //通过 preset-env 已经使用了全局的 regeneratorRuntime, 不再需要 transform-runtime 提供的 不污染全局的 regeneratorRuntime
        useESModules: true // 使用 es modules helpers, 减少 commonJS 语法代码
      }
    ],
    [
      'component',
      {
        libraryName: 'allen-ui',
        styleLibrary: { name: 'theme-chalk', base: false }
      },
      'allen-ui'
    ]
  ]
}
