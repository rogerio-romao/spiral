const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('versions', {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
});

contextBridge.exposeInMainWorld('env', {
    isDev: process.env.NODE_ENV === 'development',
});
