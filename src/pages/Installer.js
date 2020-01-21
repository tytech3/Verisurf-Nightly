import React, { Component } from 'react';
import LinearProgress from '../components/LinearProgress.js';
import SnackBar from '../components/SnackBar.js';
import AWS from 'aws-sdk';
const {ipcRenderer} = window.require('electron');

var isMounted = false;

AWS.config.update({
    accessKeyId: localStorage.getItem('s3AccessKey'),
    secretAccessKey: localStorage.getItem('s3SecretKey')
})

class Installer extends Component {
    constructor(props) {
        super(props);
        this.variant = 'success';
        this.resultMessage = 'Installation Successful.';
        this.isDownloading = false;
        this.downloadQueue = [];
        this.openSnack = false;
        this.state={
            completed: 0,
        }

    }
    //test

    closeSnack = () => {
      this.openSnack = false;
    }

    installFiles = async (version)  => {

      console.log("Installation was clicked. \nInfo:: \nIsDownloading: " + this.isDownloading + "\nQueue: " + this.downloadQueue);

        if(this.isDownloading == true){
            console.log("attempting to open the snack....");
            this.resultMessage = ('Error: You are already installing something.')
            this.variant = 'warning'
            this.openSnack = true;
            return;
        }
        else{
          console.log("were in the else catch now!");
          this.isDownloading = true;
          this.resultMessage = ('Beginning installation on: ' + version);
          this.variant = 'info'
          this.openSnack = true;
          if(!this.downloadQueue.includes(version)){
            console.log('dq doesnt include new version. pushing to quueue')
            this.downloadQueue.push(version);
          }
        }

    
        console.log('Beginning download on: ' + this.downloadQueue[0]);
        
        var arg = {
          version: this.downloadQueue[0],
          s3AccessKey: localStorage.getItem('s3AccessKey'),
          s3SecretKey: localStorage.getItem('s3SecretKey')
        }
        
        ipcRenderer.send('downloadDir', arg);
        ipcRenderer.send("downloaderPercentage")
    
        var that = this;

        ipcRenderer.on("updateReg", (event, arg) => {
          ipcRenderer.send("currentVersion");
        })
        
        ipcRenderer.on('downloadPercentage', (event, arg) => {
              that.percentage = arg
              setTimeout(function(){
                if(arg < 0 ) {
                  that.isDownloading = false;
                  that.resultMessage = (that.downloadQueue[0] + " Installation Failed.")
                  that.variant = 'error'
                  that.openSnack = true;
                  ipcRenderer.send('clear');
                  console.log("arg < 0 so removing all listeners.");
                  ipcRenderer.removeAllListeners('downloadDir');
                  ipcRenderer.removeAllListeners('downloadPercentage');
                  ipcRenderer.removeAllListeners('downloaderPercentage');
                  that.setState({currentDownload: ''})
                }
                if(isMounted && (arg < 100 || isNaN(arg))) {
                  console.log("updating percentage bar.");
                  ipcRenderer.send("downloaderPercentage")
                  that.setState({percentage: arg});
              }
               else{
                that.isDownloading = false;
                that.resultMessage = (that.downloadQueue[0] + ' Installation Successful')
                that.variant = 'success'
                that.openSnack = true;
                that.setState({percentage: 100})
                ipcRenderer.send('clear');
                ipcRenderer.send("updateReg", that.downloadQueue[0]);
                console.log("removing all listeners.");
                ipcRenderer.removeAllListeners('downloadDir');
                ipcRenderer.removeAllListeners('downloadPercentage');
                ipcRenderer.removeAllListeners('downloaderPercentage');
                that.downloadQueue.shift();
              }}, 500)
          
          })
        }
    clearPallette = () => {
        this.setState({percentage: 0, openSnack: false})
    }

    componentWillUnmount(){
      this.props.onRef(undefined);
    }

    componentDidMount(){
      this.props.onRef(this)
        isMounted = true;
    }

    render() {
        return (
            <div>
                { this.openSnack && <SnackBar clear={this.clearPallette} result={this.resultMessage} variant={this.variant} close={this.closeSnack}/> }
                { this.isDownloading && <LinearProgress completed={this.state.percentage} /> }
            </div>
        );
    }
}

export default Installer;