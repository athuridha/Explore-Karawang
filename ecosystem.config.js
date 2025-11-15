module.exports = {
  apps: [
    {
      name: 'explore-karawang',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '.', // Run from the current working directory
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Logs will be in ~/htdocs/logs directory
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Auto restart on crash
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      // Memory management
      max_memory_restart: '500M'
    }
  ]
}
