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
import Fade from 'react-reveal/Fade';
import AWS from 'aws-sdk';


AWS.config.update({
    accessKeyId: localStorage.getItem('s3AccessKey'),
    secretAccessKey: localStorage.getItem('s3SecretKey')
})

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
            newNightly: 0,
        }
    }

    //inject install into child component, testPage
    install = (version) => {
        this.child.installFiles(version);
    }

    componentDidMount = () => {

        
        //get stats
        var s3 = new AWS.S3();
        var params ={
            Bucket: 'vs2020',
            Key: 'nightly/nightly-stats/stats.json',
        };
        var that = this;
        s3.getObject(params, function(err, data){
            if(err) {console.log(err, err.stack);}
            else {
                var response = new TextDecoder('utf-8').decode(data.Body)
                var json = JSON.parse(response)
                var inner = json['2020'];
                that.week_nightly = inner["weekly"]
                that.totalNightly = inner["total"]
                that.latestBuild = inner["latest"]

                that.graphDataPassing = [inner['Q1']['passing'], inner['Q2']['passing'], inner['Q3']['passing'], inner['Q4']['passing']]
                that.graphDataFailing = [inner['Q1']['failing'], inner['Q2']['failing'], inner['Q3']['failing'], inner['Q4']['failing']]
            }
        })
    }


    render() {
        return (
            <div>
                <Installer onRef={ref => (this.child = ref)}  />
                <div className={'sideBar'}>
                <Fade top cascade>
                    <div className={'navSelect'}>
                        <NavLink to={'/home'}  activeClassName="navOptionActive" >
                            <div className={'navOption'} >
 
                                <HomeIcon 
                                style={{fontSize: 75, textAlign: 'center', alignSelf: 'center', 
                                color: 'white', marginTop: 10, marginBottom: 0}}/>
                                
                                <h1>Home</h1>
                                
                            </div>
                        </NavLink>

                         <NavLink to={'/test'}  activeClassName="navOptionActive">
                            <div className={'navOption'}>
                            <Badge badgeContent={this.state.newNightly} color="secondary" style={{position: 'absolute', marginLeft: '10rem', marginTop: '2.2rem'}}>
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
                    <Switch>
                        <Route exact path="/home">
                            <HomePage 
                            install={this.install} 
                            latestBuild={this.latestBuild}
                            totalNightly={this.totalNightly} 
                            totalWeekly={this.week_nightly}
                            graphDataPassing={this.graphDataPassing}
                            graphDataFailing={this.graphDataFailing} />
                        </Route>
                        <Route exact path="/test">
                            <TestPage  install={this.install} json={this.jsonresp} />
                        </Route>
                        <Route exact path="/settings">
                            <Settings />
                        </Route>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default Layout;