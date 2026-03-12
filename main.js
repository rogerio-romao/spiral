// oxlint-disable promise/always-return
// oxlint-disable promise/prefer-await-to-then
// oxlint-disable promise/catch-or-return
// oxlint-disable unicorn/prefer-top-level-await
// oxlint-disable sort-keys
import { app, BrowserWindow, dialog, ipcMain, Menu, screen } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * This is a helper function that takes a file path and returns the track name, which is the file name without the extension. For example, if the file path is "/path/to/song.mp3", it will return "song". This is used to display the track name in the playlist and other parts of the UI.
 * @param {string} filePath - the path to the file
 * @returns {string} the track name, which is the file name without the extension
 */
function trackNameFromPath(filePath) {
    return path.parse(filePath).name;
}

/** @typedef {{ filePath: string, trackName: string, fileUrl: string }} FileResult */

/**
 * This is a helper function that takes a file path and returns an object containing the file path, track name, and file URL. The track name is derived from the file path using the `trackNameFromPath` function, and the file URL is created using the `pathToFileURL` function from the Node.js URL module. This object is used to represent a track in the playlist and other parts of the UI.
 * @param {string} filePath - the path to the file
 * @returns {FileResult} an object containing the file path, track name, and file URL
 */
function fileResult(filePath) {
    return {
        filePath,
        trackName: trackNameFromPath(filePath),
        fileUrl: pathToFileURL(filePath).href,
    };
}

/**
 * This IPC handler listens for the 'dialog:openFiles' event from the renderer process, which is triggered when the user wants to open audio files. It opens a file dialog that allows the user to select one or more audio files with specific extensions (mp3, flac, wav, ogg, m4a, aac, opus, weba). If the user cancels the dialog, it returns an empty array. Otherwise, it returns an array of file result objects for each selected file, which includes the file path, track name, and file URL. This allows the renderer process to display the selected tracks in the playlist and other parts of the UI.
 */
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

/**
 * This IPC handler listens for the 'playlist:resolveFiles' event from the renderer process, which is triggered when the application opens and needs to restore the previously saved playlist. It takes an array of file paths as an argument and filters out any paths that do not exist on the file system using `fs.existsSync`. For each existing file path, it creates a file result object using the `fileResult` function, which includes the file path, track name, and file URL. This allows the renderer process to update the playlist with valid tracks and remove any tracks that no longer exist on the file system.
 */
ipcMain.handle('playlist:resolveFiles', async (_event, paths) => {
    if (!Array.isArray(paths)) {
        return [];
    }

    try {
        const filePaths = paths.filter((filePath) => typeof filePath === 'string');
        const stats = await Promise.allSettled(
            filePaths.map((filePath) => fs.promises.stat(filePath)),
        );

        return stats
            .map((result, index) => {
                if (result.status !== 'fulfilled' || !result.value.isFile()) {
                    return null;
                }
                return fileResult(filePaths[index]);
            })
            .filter((value) => value !== null);
    } catch {
        return [];
    }
});

// In development mode, we set up a custom application menu that includes a "View" menu with an option to toggle the developer tools. In production mode, we remove the application menu entirely.
if (process.env.NODE_ENV === 'development') {
    const menuTemplate = [
        {
            // Always "Electron" in dev, "Spiral Player" in prod - uses the productName from package.json
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

    mainWindow.loadFile(path.join(path.dirname(fileURLToPath(import.meta.url)), 'index.html'));
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
