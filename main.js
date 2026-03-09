// oxlint-disable promise/always-return
// oxlint-disable promise/prefer-await-to-then
// oxlint-disable promise/catch-or-return
// oxlint-disable unicorn/prefer-top-level-await
// oxlint-disable sort-keys
import { app, BrowserWindow, dialog, ipcMain, Menu, screen } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

function trackNameFromPath(filePath) {
    const base = path.basename(filePath);
    const dotIndex = base.indexOf('.');
    return dotIndex > 0 ? base.slice(0, dotIndex) : base;
}

function fileResult(filePath) {
    return {
        filePath,
        trackName: trackNameFromPath(filePath),
        fileUrl: pathToFileURL(filePath).href,
    };
}

ipcMain.handle('dialog:openFiles', async () => {
    const [win] = BrowserWindow.getAllWindows();
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
        properties: ['openFile', 'multiSelections'],
        filters: [
            {
                name: 'Audio',
                extensions: ['mp3', 'flac', 'wav', 'ogg', 'm4a', 'aac', 'opus', 'weba'],
            },
        ],
    });
    if (canceled) {
        return [];
    }
    return filePaths.map((fp) => fileResult(fp));
});

ipcMain.handle('playlist:resolveFiles', (_event, paths) =>
    paths.filter((filePath) => fs.existsSync(filePath)).map((fp) => fileResult(fp)),
);

if (process.env.NODE_ENV === 'development') {
    const menuTemplate = [
        {
            // "Electron" in dev, "Your Name" in prod
            label: app.name,
            submenu: [{ role: 'quit' }],
        },
        {
            label: 'View',
            submenu: [{ role: 'toggleDevTools' }],
        },
    ];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
} else {
    Menu.setApplicationMenu(null);
}

function createWindow(width, height) {
    const mainWindow = new BrowserWindow({
        width,
        height,
        useContentSize: true,
        webPreferences: {
            preload: path.join(path.dirname(fileURLToPath(import.meta.url)), 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    mainWindow.loadFile('index.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//
app.whenReady().then(() => {
    // get screen size
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    createWindow(width, height);

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open. In this case, we check if there are no windows and create a new one, since we only want one window open at a time.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow(width, height);
        }
    });
});

app.on('window-all-closed', () => {
    app.quit();
});
