import { app, BrowserWindow, Menu, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

if (process.env.NODE_ENV === 'development') {
    const menuTemplate = [
        {
            label: app.name, // "Electron" in dev, "Your Name" in prod
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
            preload: path.join(
                path.dirname(fileURLToPath(import.meta.url)),
                'preload.js',
            ),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    mainWindow.loadFile('index.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // get screen size
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    createWindow(width, height);

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open. In this case, we check if there are no windows and create a new one, since we only want one window open at a time.
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow(width, height);
    });
});

app.on('window-all-closed', function () {
    app.quit();
});
