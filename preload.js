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

contextBridge.exposeInMainWorld('electronAPI', {
    openFiles: () => ipcRenderer.invoke('dialog:openFiles'),
    resolveFiles: (paths) => ipcRenderer.invoke('playlist:resolveFiles', paths),
});
