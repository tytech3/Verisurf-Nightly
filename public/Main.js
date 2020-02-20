const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const regedit = require("regedit");
const { autoUpdater } = require('electron-updater');
const { dialog, Notification } = require('electron');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let installPath
//app.commandLine.appendSwitch('ignore-certificate-errors');
const nativeImage = require('electron').nativeImage;
let image = nativeImage.createFromPath(__dirname + './icon.ico'); 
 // where public folder on the root dir


function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
      height: 800,
      width: 1200,
      minHeight: 800,
      minWidth: 1200,
      icon: image,
      webPreferences: { 
        nodeIntegration: true,
        webSecurity: false,
      }
  })

  //prod:
  if(app.isPackaged){
    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
    win.setMenu(null);
  }
  else{
    win.loadURL(`http://localhost:3000`);
    win.webContents.openDevTools();
  }

  win.webContents.session.clearCache();
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}




regedit.setExternalVBSLocation('resources/regedit/vbs');

regedit.list('HKLM\\SOFTWARE\\CNC Software, Inc.\\Mastercam 2020', function(err, result){
    if(err){
      installPath = null
    }
    else{
      installPath = result['HKLM\\SOFTWARE\\CNC Software, Inc.\\Mastercam 2020']['values']['Directory']['value'];
    }
    
})




ipcMain.on("getInstallPath", (event, arg) => {
  event.reply("getInstallPath", installPath);
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
 autoUpdater.checkForUpdatesAndNotify();
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
    autoUpdater.checkForUpdatesAndNotify();
    }
    
  }
)

ipcMain.on("checkUpdate", (event, arg) => {
  autoUpdater.checkForUpdatesAndNotify();
})

autoUpdater.on('error', (err) => {
  
  var x = "An error occurred while updating\n\n Error: " + err
  dialog.showMessageBox({
    message: x
  })
})

autoUpdater.on('update-available', (info) => {
  var options = {
    title: "Nightly Update",
    body: "The new version of Nightly will now be downloaded."
  }
  let myNoti = new Notification(options)
  myNoti.show();

})

autoUpdater.on('update-not-available', (info) => {
  var options = {
    title: "Nightly Update",
    body: "There is no update available at this time."
  }
  let myNoti = new Notification(options)
  myNoti.show();
})

ipcMain.on("currentVersion", (event, arg) => {
    regedit.list('HKLM\\SOFTWARE\\Verisurf Software, Inc.\\Verisurf 2020', function(err, result){
    if(err){
      event.reply('currentVersion', null);
    }
    else{
    let currentVersion = result['HKLM\\SOFTWARE\\Verisurf Software, Inc.\\Verisurf 2020']['values']['Version']['value'];
    event.reply('currentVersion', currentVersion);
    }
  });
})



ipcMain.on("updateReg", (event, arg) => {
  values = {
    'HKLM\\SOFTWARE\\Verisurf Software, Inc.\\Verisurf 2020': {
      'Version':{
        value: arg,
        type: 'REG_SZ'
      }
    }
  }

  regedit.putValue(values, function(err){
    if(err){
      console.log('error putting reg value.')
    }
    else{
      console.log("success putting reg value.");
      event.reply("updateReg", "success")
    }
  })

})

//"downloadDir" = name of event. This is the string you will send when you call this method.
//You can send an object for arg. This could come in handy later. 

//Heres how you will call this in render process, or your react modules:

//  const {ipcRenderer} = window.require('electron')
//  ipcRenderer.send('downloadDir');

ipcMain.on('downloadDir', (event, arg) => {
  
  var version = arg.version;
  var accessKey = arg.s3AccessKey
  var secretKey = arg.s3SecretKey

  var s3 = require('@auth0/s3')
  var client = s3.createClient({
    maxAsyncS3: 20,     // this is the default
    s3RetryCount: 3,    // this is the default
    s3RetryDelay: 1000, // this is the default
    multipartUploadThreshold: 20971520, // this is the default (20 MB)
    multipartUploadSize: 15728640, // this is the default (15 MB)
    s3Options: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
      region: "us-west-2",
      // endpoint: 's3.yourdomain.com',
      // sslEnabled: false
      // any other options are passed to new AWS.S3()
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    },
  });


  //YOU MAY NOW CHANGE THE PATH TO installPath
  var downloader = client.downloadDir({
    localDir: installPath,
    deleteRemoved: false,
    s3Params:{
      Bucket: 'vs2020',
      Prefix: 'nightly/' + version + '/install/root'
    }
  });


  downloader.on('error', function(err) {
    var x = ("Error installing files:\n\n " + err)
    dialog.showMessageBox({
      message: x
    })
    percentage = -1;
  })


  var percentage = 0; 

  downloader.on('progress', function() {
    percentage = parseInt(100 * (downloader.progressMd5Amount/downloader.progressMd5Total));
  });

  downloader.on('end', function() {

    percentage = 100;
    console.log("done downloading");
  });
  

  ipcMain.on('downloaderPercentage', (event, arg) => {
    event.reply('downloadPercentage', percentage);
    console.log("Main % val: " + percentage);
  })

  ipcMain.on('clear', (event, arg) => {
    ipcMain.removeAllListeners("downloaderPercentage")
    percentage = 0;
  })
  
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.