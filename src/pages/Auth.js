import React, { Component } from 'react'
import './Auth.css';
import { withStyles } from '@material-ui/styles';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Layout from '../Layout.js'
import AWS from 'aws-sdk';
import SnackBar from '../components/SnackBar.js';
import Button from '@material-ui/core/Button';




var useStyles = theme => ({
    root: {
      '& > *': {
        width: 500,
      },
    },
    cssLabel: {
        color: 'white',
        borderColor: 'white'
    },
    cssFocused: {
        borderColor: 'white'
    },
    cssOutlinedInput: {
        borderColor: 'white'
    },
    cssFocused: {
        borderColor: 'white'
    },
    notchedOutline: {
        borderColor: 'white'
    },
    underline:{
        color: 'white',
        borderBottom: 'white',
        borderColor: 'white',
        '&:after': {
            borderColor: 'white',          
        },              
        '&:focused::after': {
            borderColor: 'white',
        },                                  
        '&:before': {
            borderColor: 'white',          
        },
        '&:hover:not($disabled):not($focused):not($error):before': {
            borderColor: 'white',
        },
        '&$disabled:before': {
            borderColor: 'white',
        },              
    }

    
  });

class Auth extends Component {

    constructor(){
        super();
        this.accessKey = ''
        this.secretKey = ''
        this.pass = null
        this.errorMessage = 'Error logging in. Please check credentials and try again.'
        this.variant = 'error'

        this.state={
            loginResult: false,
            openSnack: false,
        }
    }

    closeSnack = () => {
        this.setState({openSnack: false})
    }
    
    checkCreds = () => {
      console.log("updating s3 with \nAccessKeyId: " + this.accessKey + "\nSecret: " + this.secretKey);
      AWS.config.update({
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey
    })
      var s3 = new AWS.S3();
      var params ={
          Bucket: 'vs2020',
          Key: 'nightly/nightly-stats/stats.json',
      };
      var that = this;
      s3.getObject(params, function(err, data){
          if(err) {this.setState({openSnack: true})}
          else {
              that.setState({loginResult: true})
          }
      })
    }

    render() {
        const { classes } = this.props;

        if(this.state.loginResult){
            localStorage.setItem('auth', true);
            localStorage.setItem('s3AccessKey', this.accessKey)
            localStorage.setItem('s3SecretKey', this.secretKey);
            // TODO : loading auth token in to nedb. check it in index.js to persist an authenticated user.
            return <Layout />
        }

        return (
            <div className={"container"}>
                <div id='stars'></div>
                <div id='stars2'></div>
                <div id='stars3'></div>
                <div className={'titleHeader'}>
                <Typography style={{fontSize: '5.0rem', color: 'gold', 
                                    fontWeight: 'lighter', letterSpacing: 25, textShadow: '5px 5px 20px #FFFFFF', opacity: .9}} 
                            variant="overline" 
                            display="block" 
                            gutterBottom>
                    verisurf
              </Typography>
              <Typography style={{fontSize: '5.0rem', color: 'gold', 
                                fontWeight: 'lighter', letterSpacing: 25, textShadow: '5px 5px 20px #FFFFFF', opacity: .9}} 
                                variant="overline" 
                                display="block" 
                                gutterBottom>
                nightly
                </Typography>
              </div>
              <form 
                className={classes.root} 
                autoComplete="off"
                onSubmit={(event) => {
                    event.preventDefault();
                }}>
                <Input 
                    style={{width: '25vh', color: 'white', textAlign: 'center',}} 
                    placeholder="S3 Access Key" 
                    inputProps={{'aria-label': 'description'}}
                    underlineFocusStyle={{borderColor: 'white'}}
                    classes={{underline: classes.underline}}
                    onChange={(event)=> {
                        this.accessKey = event.target.value;
                    }}
                    InputLabelProps={{
                        classes: {
                          root: classes.cssLabel,
                          focused: classes.cssFocused,
                          underline: classes.underline,
                        },
                      }}
                    InputProps={{
                    classes: {
                        root: classes.cssOutlinedInput,
                        focused: classes.cssFocused,
                        notchedOutline: classes.notchedOutline,
                        }
                       }} />
              </form>

              <form 
              style={{marginTop: '1rem'}}
              className={classes.root} 
              autoComplete="off"
              onSubmit={(event) => {
                  event.preventDefault();
              }}>   

              <Input 
                  style={{width: '25vh', color: 'white', textAlign: 'center',}} 
                  placeholder="S3 Secret Key" 
                  inputProps={{'aria-label': 'description'}}
                  underlineFocusStyle={{borderColor: 'white'}}
                  classes={{underline: classes.underline}}
                  onChange={(event)=> {
                      this.secretKey = event.target.value;
                  }}
                  InputLabelProps={{
                      classes: {
                        root: classes.cssLabel,
                        focused: classes.cssFocused,
                        underline: classes.underline,
                      },
                    }}
                  InputProps={{
                  classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                      }
                     }} />
            </form>
            <Button variant="contained" style={{marginTop: '1rem'}} onClick={this.checkCreds}>Login</Button>
            { this.state.openSnack && <SnackBar result={this.errorMessage} variant={this.variant} clear={this.closeSnack} close={this.clsoeSnack}/> }
            </div>
        )
    }
}

export default withStyles(useStyles)(Auth);