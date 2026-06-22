module.exports = {
  apps: [{
    name: 'daurin',
    script: 'node_modules/.bin/next',
    args: 'start',
    env: { NODE_ENV: 'production', PORT: 3000 },
    watch: false,
    max_memory_restart: '500M',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
  }, {
    name: 'cloudflared',
    script: 'cloudflared',
    args: 'tunnel run daurin',
    watch: false,
  }]
}
