// nusta Arena Planner: desktop shell. The whole planner lives in app/index.html.
const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1600, height: 960, minWidth: 1100, minHeight: 700,
    backgroundColor: '#09090b', title: 'nusta Arena Planner',
    icon: path.join(__dirname, 'build', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true }
  });
  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // Save project / screenshots / renders / kit lists: always ask where to save.
  win.webContents.session.on('will-download', (event, item) => {
    const target = dialog.showSaveDialogSync(win, { defaultPath: path.join(app.getPath('documents'), item.getFilename()) });
    if (target) item.setSavePath(target); else item.cancel();
  });
  // Links open in the normal browser.
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

Menu.setApplicationMenu(Menu.buildFromTemplate([
  { label: 'File', submenu: [{ role: 'reload', label: 'Reload' }, { type: 'separator' }, { role: 'quit', label: 'Exit' }] },
  { label: 'View', submenu: [{ role: 'togglefullscreen' }, { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { type: 'separator' }, { role: 'toggleDevTools' }] },
  { label: 'Help', submenu: [{ label: 'About nusta Arena Planner', click: () => dialog.showMessageBox({ type: 'info', title: 'nusta Arena Planner', message: `nusta Arena Planner ${app.getVersion()}`, detail: 'Ideas into motion.' }) }] }
]));

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
