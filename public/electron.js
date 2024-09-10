const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

async function createWindow() {
  const isDev = await import('electron-is-dev').then(module => module.default);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation:true,
      nodeIntegration: false,
      webSecurity: false,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => (mainWindow = null));
}

// Start the Flask server
function startFlaskServer() {
  let venvPath;
  if (process.env.NODE_ENV === 'development') {
    venvPath = path.join(__dirname, '..', 'api', 'venv', 'Scripts', 'python.exe');
  } else {
    venvPath = path.join(process.resourcesPath, 'api', 'venv', 'Scripts', 'python.exe');
  }
  
  const scriptPath = process.env.NODE_ENV === 'development'
  ? path.join(__dirname, '..', 'api', 'api.py')
  : path.join(process.resourcesPath, 'api', 'api.py');  // Correct path in production

  console.log(`Starting Flask server with Python at: ${venvPath}`);
  console.log(`Using script path: ${scriptPath}`);

  const flaskServer = spawn(venvPath, [scriptPath]);

  flaskServer.stdout.on('data', (data) => {
    console.log(`Flask: ${data}`);
  });

  flaskServer.stderr.on('data', (data) => {
    console.error(`Flask error: ${data}`);
  });

  flaskServer.on('close', (code) => {
    console.log(`Flask server exited with code ${code}`);
  });
}

app.on('ready', () => {
  // startFlaskServer();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
