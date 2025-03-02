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

ipcMain.handle('read-zprofile', async (event, fileName) => {
    const filePath = path.join(process.env.HOME, fileName);
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data;
    } catch (error) {
        await dialog.showMessageBox({
            type: 'error',
            title: 'Error',
            message: `Failed to read ${fileName}: ${error.message}`
        });
        return null;
    }
});

ipcMain.handle('write-zprofile', async (event, data) => {
    const filePath = path.join(process.env.HOME, data[0]);
    try {
        fs.writeFileSync(filePath, data[1], 'utf8');
        return true;
    } catch (error) {
        await dialog.showMessageBox({
            type: 'error',
            title: 'Error',
            message: `Failed to write ${data[0]}: ${error.message}`
        });
        return false;
    }
});
