import React, { Component } from 'react'
import './Auth.css';
import { withStyles } from '@material-ui/styles';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Layout from '../Layout.js'
import AWS from 'aws-sdk';


AWS.config.update({
    accessKeyId: "AKIAIF77IPCKK74GYAPA",
    secretAccessKey: "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"
})

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
        this.inputText=''
        this.pass = null

        this.state={
            loginResult: false,
        }
    }

    componentDidMount(){
        var s3 = new AWS.S3();
        var params ={
            Bucket: 'vs2020',
            Key: 'nightly/auth/nightlypassword.txt',
        };
        var that = this;
        s3.getObject(params, function(err, data){
            if(err) {console.log(err, err.stack);}
            else {
                var response = new TextDecoder('utf-8').decode(data.Body)
                console.log("res recv: " + response);
                that.pass = response
            }
        })
    }

    render() {
        const { classes } = this.props;

        if(this.state.loginResult){
            localStorage.setItem('auth', true);
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
                    if(this.inputText == this.pass && this.pass != null){
                        this.setState({loginResult: true})
                    }
                    console.log(this.inputText)
                }}>
                <Input 
                    style={{width: '25vh', color: 'white', textAlign: 'center',}} 
                    placeholder="Login Code" 
                    inputProps={{'aria-label': 'description'}}
                    underlineFocusStyle={{borderColor: 'white'}}
                    classes={{underline: classes.underline}}
                    onChange={(event)=> {
                        this.inputText = event.target.value;
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
            </div>
        )
    }
}

export default withStyles(useStyles)(Auth);