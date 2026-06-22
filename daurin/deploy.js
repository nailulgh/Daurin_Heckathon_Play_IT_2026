const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  console.log('[*] Connected to VPS 103.245.39.102');
  
  const setupCmds = `
    echo "[*] Updating and installing dependencies..."
    dnf install -y curl tar unzip
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    dnf install -y nodejs
    npm install -g pm2
    curl -L --output cloudflared.rpm https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-x86_64.rpm
    dnf localinstall -y cloudflared.rpm
    mkdir -p /var/www/daurin
    echo "[*] Setup complete"
  `;

  conn.exec(setupCmds, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('[*] Setup finished. Uploading source code...');
      conn.sftp((err, sftp) => {
        if (err) throw err;
        const readStream = fs.createReadStream('c:\\\\NAILUL\\\\Play_IT\\\\daurin.tar.gz');
        const writeStream = sftp.createWriteStream('/var/www/daurin/daurin.tar.gz');
        readStream.pipe(writeStream);
        writeStream.on('close', () => {
          console.log('[*] Upload complete. Building and starting application...');
          
          const buildCmds = `
            cd /var/www/daurin
            tar -xzf daurin.tar.gz
            npm install
            npx prisma generate
            npm run build
            pm2 delete daurin || true
            pm2 start npm --name daurin -- start
            pm2 save
            env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root || true
            echo "======================================"
            echo "[*] Daurin App is running via PM2."
            echo "======================================"
            echo "We will now run 'cloudflared tunnel login'."
            echo "Please copy the URL that appears below and open it in your browser!"
            cloudflared tunnel login
          `;
          
          conn.exec(buildCmds, { pty: true }, (err, stream2) => {
            if (err) throw err;
            stream2.on('close', (code) => {
              console.log('[*] Script finished with code ' + code);
              conn.end();
            }).on('data', (data) => {
              process.stdout.write(data.toString());
            }).stderr.on('data', (data) => {
              process.stderr.write(data.toString());
            });
          });
        });
      });
    }).on('data', (data) => {
      process.stdout.write(data.toString());
    }).stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });
  });
}).on('error', (err) => {
    console.error('[-] Connection Error: ', err);
}).connect({
  host: '103.245.39.102',
  port: 22,
  username: 'root',
  password: 'Cbn[g09vJ9N8)C'
});
