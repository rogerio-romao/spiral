// oxlint-disable unicorn/prefer-module
// oxlint-disable-next-line typescript/no-require-imports
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    node: process.versions.node,
});

contextBridge.exposeInMainWorld('env', {
    isDevEnvironment: process.env.NODE_ENV === 'development',
});

// This is for the music player to allow saving playlist and resolving files upon reopening the app. The main process will handle the file system access and return the results to the renderer process.
contextBridge.exposeInMainWorld('electronAPI', {
    openFiles: () => ipcRenderer.invoke('dialog:openFiles'),
    resolveFiles: (paths) => ipcRenderer.invoke('playlist:resolveFiles', paths),
});
