
const { app, Menu, screen, BrowserWindow } = require('electron');

const createWindow = () => {
    const display = screen.getPrimaryDisplay();
    const window = new BrowserWindow({
        autoHideMenuBar: true,
        width: display.bounds.width,
        height: display.bounds.height,
        
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
        }
    });

  window.setKiosk(true);
  window.setFullScreen(false);
  Menu.setApplicationMenu(null);
  window.loadURL('http://localhost:3000/');
}

app.whenReady().then(() => {
  console.log("App Window Running complete!\n") & createWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
  
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) { 
    createWindow();
  }
});