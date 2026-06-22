module.exports = {
  apps: [
    {
      name: "daurin-web",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
