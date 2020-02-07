import React, { Component } from 'react'
import './Auth.css';
import { withStyles } from '@material-ui/styles';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Layout from '../Layout.js'
import AWS from 'aws-sdk';
import SnackBar from '../components/SnackBar.js';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


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

        //signup variables
        this.suFirstName=""
        this.suLastName=""
        this.suEmail=""
        this.suPassword=""
        this.suConfirmPassword=""

        this.state={
            loginResult: false,
            openSnack: false,
            isSigningUp: true,
            emailHelper: "",
            passwordHelper: "",
            confirmedPasswordHelper: "",
            emailError: false,
            passwordError: false,
            confirmPasswordError: false,
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
          if(err) {that.setState({openSnack: true})}
          else {
              that.setState({loginResult: true})
          }
      })
    }

    signUpClick = () => {
        if(!this.validateEmailRegxp()){
            this.setState({emailError: true, emailHelper: "Invalid email. Must be verisurf domain."})
        }
        if(!this.validatePasswordRegxp()){
            this.setState({passwordError: true, passwordHelper: "Password must be minimum of 8 characters with at least 1 number & 1 letter."})
        }
        if(this.suPassword !== this.suConfirmPassword){
            this.setState({confirmPasswordError: true, confirmedPasswordHelper: "Passwords do not match."})
        }
    }


    validatePasswordRegxp = () => {
        var passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordPattern.test(this.suPassword);
    }

    validateEmailRegxp = () => {
        var emailPattern = /^[a-zA-Z0-9._-]+@[v | V]{1}[e|E]{1}[r|R]{1}[i|I]{1}[s|S]{1}[u|U]{1}[r|R]{1}[f|F]{1}\.[c][o][m]$/;
        return emailPattern.test(this.suEmail);
    }

    render() {
        const { classes } = this.props;

        if(this.state.loginResult){
            localStorage.setItem('auth', true);
            localStorage.setItem('s3AccessKey', this.accessKey)
            localStorage.setItem('s3SecretKey', this.secretKey)
            return <Layout />
        }

        if(this.state.isSigningUp){
            return(
                <div className={"container"}>
                <div id='stars'></div>
                <div id='stars2'></div>
                <div id='stars3'></div>
                <div className={"signupForm"}>
                    <div className={"signupCard"}>
                        <div className={"signupHeader"}>
                            <Typography color='secondary' style={{fontSize: '2.0rem', color: 'black', 
                            fontWeight: 'lighter', letterSpacing: 5}} 
                            variant="overline" 
                            display="block" 
                            gutterBottom>
                                Sign Up
                            </Typography>
                        </div>
                        <div className={"nameForms"}>
                            <TextField 
                                id="standard-basic" 
                                label="Firstname"
                                onChange={(event) => {
                                    this.suFirstName=event.target.value
                                }} />
                            <TextField 
                                id="standard-basic" 
                                label="Lastname"
                                onChange={(event) => {
                                    this.suLastName=event.target.value
                                }} />
                        </div>
                        <div className={"restOfForm"}>
                            <TextField  
                                style={{marginTop: "3%", marginLeft: "3%", marginRight: "3%", marginBottom: '.1rem'}} 
                                id="standard-basic" 
                                label="Email"
                                error={this.state.emailError}
                                helperText={this.state.emailHelper}
                                onFocus={() => {this.setState({emailError: false, emailHelper: ""})}}
                                onChange={(event) => {
                                    this.suEmail=event.target.value
                                }} />
                            <TextField 
                                type="password" 
                                style={{marginTop: "5%", marginLeft: "3%", marginRight: "3%", marginBottom: '.1rem'}} 
                                id="standard-basic" 
                                label="Password"
                                error={this.state.passwordError}
                                helperText={this.state.passwordHelper}
                                onFocus={() => {this.setState({passwordError: false, passwordHelper: ""})}}
                                onChange={(event) => {
                                    this.suPassword=event.target.value
                                }} />
                            <TextField 
                                type="password" 
                                style={{marginTop: "5%", marginLeft: "3%", marginRight: "3%"}} 
                                id="standard-basic" 
                                label="Confirm Password"
                                error={this.state.confirmPasswordError}
                                helperText={this.state.confirmedPasswordHelper}
                                onFocus={() => {this.setState({confirmPasswordError: false, confirmedPasswordHelper: ""})}}
                                onChange={(event) => {
                                    this.suConfirmPassword=event.target.value
                                }} />
                        </div>
                        <div className={"signupFooter"}>
                            <div className={"signupButton"}>
                                <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    style={{paddingLeft: "5rem", paddingRight: "5rem"}}
                                    onClick={this.signUpClick}>
                                    Sign Up
                                </Button>
                            </div>
                            <div className={"backToLogin"}>
                                <Typography style={{marginRight: '10px'}}>
                                    Already have an account?
                                </Typography>
                                <Typography color={"secondary"} style={{cursor: "pointer"}} onClick={()=>{this.setState({isSigningUp: !this.state.isSigningUp})}}>
                                    {" Login here."}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
                { this.state.openSnack && <SnackBar result={this.errorMessage} variant={this.variant} clear={this.closeSnack} close={this.closeSnack}/> }
                </div>
            )
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
                    placeholder="Email" 
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
                  this.checkCreds();
              }}>   

              <Input 
                  style={{width: '25vh', color: 'white', textAlign: 'center',}} 
                  placeholder="Password" 
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
            <Button variant="contained" 
                    color="secondary" 
                    style={{marginTop: '1rem', marginLeft: '1rem'}} 
                    onClick={() => {this.setState({isSigningUp: true})}}>
                Sign Up
            </Button>
            { this.state.openSnack && <SnackBar result={this.errorMessage} variant={this.variant} clear={this.closeSnack} close={this.closeSnack}/> }
            </div>
        )
    }
}

export default withStyles(useStyles)(Auth);