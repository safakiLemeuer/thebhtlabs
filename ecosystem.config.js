module.exports = {
  apps: [
    {
      name: 'main',
      cwd: './apps/main',
      script: 'server.js',
      env: { PORT: 3000, NODE_ENV: 'production' },
    },
    {
      name: 'audit',
      cwd: './apps/audit',
      script: 'server.js',
      env: { PORT: 3001, NODE_ENV: 'production' },
    },
    {
      name: 'assess',
      cwd: './apps/assess',
      script: 'server.js',
      env: { PORT: 3002, NODE_ENV: 'production' },
    },
    {
      name: 'fed',
      cwd: './apps/fed',
      script: 'server.js',
      env: { PORT: 3003, NODE_ENV: 'production' },
    },
  ],
};
