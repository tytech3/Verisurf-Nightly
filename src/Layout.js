import React, { Component } from 'react';
import {NavLink, Route, Switch} from 'react-router-dom';
import './Layout.css';
import HomeIcon from '@material-ui/icons/Home';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import SettingsIcon from '@material-ui/icons/Settings';
import Badge from '@material-ui/core/Badge';
import Installer from './pages/Installer.js';
import HomePage from './pages/HomePage.js';
import TestPage from './pages/TestPage.js';
import Settings from './pages/Settings.js';
import Auth from './pages/Auth.js';
import Fade from 'react-reveal/Fade';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { fade, withStyles } from '@material-ui/core/styles';
import VersionMenu from './components/VersionMenu';
import HttpRequest from './utilities/HttpRequest';

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
      textAlign: 'center',
      fontSize: '1rem'
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


const {ipcRenderer} = window.require('electron');

//This component is the parent of all views after authentication.
//It handles setting up data in the homepage, and then setting 
//the active page to home.
class Layout extends Component {

    constructor(){
        super();
        this.totalNightly = 0
        this.week_nightly = 0
        this.latestBuild = 0

        this.graphDataPassing = [0, 0, 0, 0]
        this.graphDataFailing = [0, 0, 0, 0]
        this.state ={
            version: '',
            noNewNightly: true,
            authorized: true,
            currentVersion: '',
            hasGraphData: false
        }
    }

    //inject install into child component, testPage
    install = (version) => {
        this.child.installFiles(version);
    }

    clearNewNightly = () => {
        this.setState({noNewNightly: true})
    }

    logout = () => {
        localStorage.removeItem("rememberMe")
        localStorage.removeItem("userName")
        localStorage.removeItem("pass")
        this.setState({authorized: false})
    }

    setUpData = (data) => {
        var json = JSON.parse(data)
        var inner = json['2020'];
        this.week_nightly = inner["weekly"]
        this.totalNightly = inner["total"]
        this.latestBuild = inner["latest"]

        this.graphDataPassing = [inner['Q1']['passing'], inner['Q2']['passing'], inner['Q3']['passing'], inner['Q4']['passing']]
        this.graphDataFailing = [inner['Q1']['failing'], inner['Q2']['failing'], inner['Q3']['failing'], inner['Q4']['failing']]

        if(this.latestBuild !== localStorage.getItem('recentBuild')){
            this.setState({noNewNightly: false})
        }
        this.setState({hasGraphData: true})           
    }

    componentDidMount = () => {
        var startingpage = ''
        if(localStorage.getItem('startPage')){
            var x = localStorage.getItem('startPage')
            startingpage =  x === '0' ? '/home' : '/test'
        }
        else{
            startingpage = '/home'
        }
        this.props.history.push(startingpage)
        HttpRequest('/stats/2020').then(result => {
            this.setUpData(result)
        }, err => console.log(err))

        ipcRenderer.send("currentVersion");
        ipcRenderer.on("currentVersion", (event, arg) => {
            arg = arg === null ? 'Verisurf Not Installed' : arg
          this.setState({currentVersion: arg})
        })        
    }

    searched = (event) => {

        if(this.props.history.location.pathname !== '/test'){
            this.props.history.push('/test')
        }
        else if(this.props.history.location.pathname === '/test'){
            this.searchBuild.searchBuild(event.target.value)
        }
    }


    render() {
        const {classes} = this.props;
        if(!this.state.authorized){
            return <Auth history={this.props.history} />
        }
        return (
            <div>
                
                <div className={classes.root}>
                    <AppBar position="fixed" style={{backgroundColor: '#1A262B'}}>
                    <Toolbar>
                        <VersionMenu />
                        <Typography className={classes.title} variant="subtitle2" noWrap >
                            Your Installed Build: {this.state.currentVersion}
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
                <div className={'sideBar'}>
                <Fade top cascade>
                    <div className={'navSelect'}>
                        <NavLink to={'/home'}  activeClassName="navOptionActive" >
                            <div className={'navOption'}>
 
                                <HomeIcon 
                                style={{fontSize: 75, textAlign: 'center', alignSelf: 'center', 
                                color: 'white', marginTop: 10, marginBottom: 0}}/>
                                
                                <h1>Home</h1>
                                
                            </div>
                        </NavLink>

                         <NavLink to={'/test'}  activeClassName="navOptionActive">
                            <div className={'navOption'}>
                            <Badge variant="dot" invisible={this.state.noNewNightly} color="secondary" style={{position: 'absolute', marginLeft: '8.5rem', marginTop: '2.2rem'}}>
                            </Badge>
                                <Brightness3Icon 
                                style={{fontSize: 75, textAlign: 'center', alignSelf: 'center', 
                                color: 'white', marginTop: 10, marginBottom: 0}}/>
                                <h1>Nightly</h1>
                            </div>
                        </NavLink>

                            <NavLink to={'/settings'} exact activeClassName="navOptionActive">
                                <div className={'navOption'} id={'settings'}>
                                    <SettingsIcon 
                                    style={{fontSize: 75, textAlign: 'center', alignSelf: 'center', 
                                    color: 'white', marginTop: 10, marginBottom: 0}}/>
                                    <h1>Settings</h1>
                                </div>
                            </NavLink>
                        </div>
                    </Fade>
                </div>

                {/*Main content area. This is where the content from the sidebar options will be displayed. */}
                <div className={'mainContent'} >
                <Installer onRef={ref => (this.child = ref)}  />
                    <Switch>
                        <Route exact path="/home">
                            <HomePage 
                            install={this.install} 
                            latestBuild={this.latestBuild}
                            totalNightly={this.totalNightly} 
                            totalWeekly={this.week_nightly}
                            graphDataPassing={this.graphDataPassing}
                            graphDataFailing={this.graphDataFailing}
                            hasGraphData={this.state.hasGraphData} />
                        </Route>
                        <Route exact path="/test">
                            <TestPage  install={this.install} json={this.jsonresp} clearBadge={this.clearNewNightly} onRef={ref => (this.searchBuild = ref)} disableInstall={this.state.currentVersion === null} />
                        </Route>
                        <Route exact path="/settings">
                            <Settings logout={this.logout}/>
                        </Route>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Layout);