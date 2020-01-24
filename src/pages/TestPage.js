import React, { Component } from 'react';
import './TestPage.css';
import VerisurfCard from '../components/verisurfCard.js';
import AWS from 'aws-sdk';
import Grid from "@material-ui/core/Grid";
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { fade, withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200,
        },
      },
    },
})

AWS.config.update({
  accessKeyId: localStorage.getItem('s3AccessKey'),
  secretAccessKey: localStorage.getItem('s3SecretKey')
})
const {ipcRenderer} = window.require('electron');

class TestPage extends Component {
    
    constructor(props){

        super(props);

        this.state ={
            cardArray: [],
            maxNightly: 20,
            prevArray: [],
            currentVersion: ""
        }
    }

    componentWillMount(){
      try{
        var max = localStorage.getItem('maxNightly');
        this.setState({maxNightly: max});
      }
      catch(e){
        console.log("no setting found.");
      }
    }

    componentDidMount = () => {

        this.props.clearBadge();

        ipcRenderer.send("currentVersion");
        ipcRenderer.on("currentVersion", (event, arg) => {
          console.log("Version Recv'd:  " + arg);
          this.setState({currentVersion: arg})
        }) 

        
        var s3 = new AWS.S3();
        var params ={
            Bucket: 'vs2020',
            Key: 'nightly/UT Results/UTR.json',
        }
        var that = this;
        s3.getObject(params, function(err, data){
            if(err) {console.log(err, err.stack);}
            else {
                var response = new TextDecoder('utf-8').decode(data.Body)
                var json = JSON.parse(response)
                var localCardArray = [];
                var i = 0;
                localStorage.setItem('recentBuild', Object.keys(json)[0]);
                for(var item in json){
                    if(i > that.state.maxNightly){
                      break;
                    }
                    var testResult = false;
                    for(var atr in json[item]){
                        if(atr['fileopen'] === 0 || atr['analysis'] === 0 || atr['database'] === 0){
                          testResult = true;
                          break;
                        }
                  }
                  localCardArray.push(
                    <Grid item md={10} style={{alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
                      <VerisurfCard props={json[item]} name={item} onClick={that.props.install} result={testResult} />
                    </Grid>
                    )
            }
            that.setState({cardArray: localCardArray, prevArray: localCardArray})
          }
        }) 
      }

  searched = (event) => {
    var result = this.state.prevArray.filter(card => card.props.children.props.name.startsWith(event.target.value));
    this.setState({cardArray: result})

  }


    render() {
      const {classes} = this.props;
        return (
        <div style={{height: '100%', width: '100%'}}>
          <div className={classes.root}>
            <AppBar position="fixed" style={{backgroundColor: '#1A262B'}}>
              <Toolbar>
                <Typography className={classes.title} variant="h6" noWrap>
                    Current Build: Verisurf 2020 ({this.state.currentVersion})
                </Typography>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search Builds…"
                    onChange={this.searched}
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </div>
              </Toolbar>
            </AppBar>
          </div>
          <div className={'cards'}>
            <div className={'downloadText'}><p id={'currentDownload'}>{this.state.currentDownload}</p></div>
                <Grid container spacing={5} style={{alignItems: 'center', alignContent: 'center', justifyContent: 'center'}}> 
                    {this.state.cardArray}
                </Grid>
          </div>
      </div>

        );
    }
}

export default withStyles(styles)(TestPage);