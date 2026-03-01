const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('versions', {
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    node: process.versions.node,
});

contextBridge.exposeInMainWorld('env', {
    isDev: process.env.NODE_ENV === 'development',
});
