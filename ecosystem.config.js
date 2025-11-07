module.exports = {
  apps: [
    {
      name: 'explore-karawang',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/home/explorekarawang/htdocs',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/home/explorekarawang/logs/err.log',
      out_file: '/home/explorekarawang/logs/out.log',
      log_file: '/home/explorekarawang/logs/combined.log',
      time_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
}
