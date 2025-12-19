module.exports = {
  apps: [
    {
      name: "whatsapp-hub",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/var/www/whatsapp-hub",
      instances: 2,
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/www/whatsapp-hub/logs/error.log",
      out_file: "/var/www/whatsapp-hub/logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
}
