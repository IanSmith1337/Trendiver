module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'Ian Smith',
        description: 'A trend-visualization resource.',
      },
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        devContentSecurityPolicy:
          "script-src 'self' https://cdn.firebase.com https://*.firebaseio.com https://cdn.jsdelivr.net 'unsafe-eval' 'unsafe-inline'; object-src 'self'",
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.js',
              name: 'main_window',
              preload: {
                js: './src/preload.js',
              },
            },
            {
              html: './src/loading.html',
              js: './src/loadRenderer.js',
              name: 'loader',
            },
            {
              html: './src/bg.html',
              js: './src/bgRenderer.js',
              name: 'bg',
              preload: {
                js: './src/bgPreload.js',
              },
            },
          ],
        },
      },
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'IanSmith1337',
          name: 'Trendiver',
        },
        draft: true,
      },
    },
  ],
}
