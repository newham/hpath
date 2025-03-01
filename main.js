const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile('index.html');

    // 打开开发者工具
    // win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('read-zprofile', async () => {
    const filePath = path.join(process.env.HOME, '.zprofile');
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data;
    } catch (error) {
        dialog.showErrorBox('Error', `Failed to read .zprofile: ${error.message}`);
        return null;
    }
});

ipcMain.handle('write-zprofile', async (event, content) => {
    const filePath = path.join(process.env.HOME, '.zprofile');
    try {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    } catch (error) {
        dialog.showErrorBox('Error', `Failed to write .zprofile: ${error.message}`);
        return false;
    }
});
