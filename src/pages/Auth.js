import React, { Component } from "react";
import "./Auth.css";
import { withStyles } from "@material-ui/styles";
import Layout from "../Layout.js";
import AWS from "aws-sdk";
import SnackBar from "../components/SnackBar.js";
import Button from "@material-ui/core/Button";
import SignUp from "./AuthCards/SignUp.js";
import Validate from "./AuthCards/Validate.js";
import LoginForm from "./AuthCards/LoginForm.js";
import Success from "./AuthCards/Success.js";
import ResetPassword from "./AuthCards/ResetPassword.js";

var useStyles = theme => ({
  root: {
    "& > *": {
      width: 500
    }
  },
  cssLabel: {
    color: "white",
    borderColor: "white"
  },
  cssFocused: {
    borderColor: "white"
  },
  cssOutlinedInput: {
    borderColor: "white"
  },
  notchedOutline: {
    borderColor: "white"
  },
  underline: {
    color: "white",
    borderBottom: "white",
    borderColor: "white",
    "&:after": {
      borderColor: "white"
    },
    "&:focused::after": {
      borderColor: "white"
    },
    "&:before": {
      borderColor: "white"
    },
    "&:hover:not($disabled):not($focused):not($error):before": {
      borderColor: "white"
    },
    "&$disabled:before": {
      borderColor: "white"
    }
  }
});

class Auth extends Component {
  constructor() {
    super();
    this.accessKey = "";
    this.secretKey = "";
    this.errorMessage =
      "Error logging in. Please check credentials and try again.";
    this.variant = "error";
    this.openSnack = false;
    this.variant = "success";
    this.resultMessage = "Password reset successfully."

    this.state = {
      loginResult: false,
      openSnack: false,
      isSigningUp: true,
      isValidating: false,
      //activeForm: <ResetPassword />
      activeForm:  <LoginForm resetPassword={this.toReset} login={this.loginToApp} />
    };
  }

  closeSnack = () => {
    this.setState({ openSnack: false });
  };

  validating = () => {
    this.setState({ isValidating: true });
  };

  checkCreds = () => {
    AWS.config.update({
      accessKeyId: this.accessKey,
      secretAccessKey: this.secretKey
    });
    var s3 = new AWS.S3();
    var params = {
      Bucket: "vs2020",
      Key: "nightly/nightly-stats/stats.json"
    };
    var that = this;
    s3.getObject(params, function(err, data) {
      if (err) {
        that.setState({ openSnack: true });
      } else {
        that.setState({ loginResult: true });
      }
    });
  };

  loginToApp = () => {
    this.setState({ loginResult: true });
  };

  toSignup = () => {
    this.setState({
      activeForm: (
        <SignUp
          toValidate={this.toValidate}
          toLogin={this.toLogin}
          toSuccess={this.toSuccess}
        />
      )
    });
  };

  toSuccess = () => {
    this.setState({
      activeForm: <Success toApp={this.loginToApp} />
    });
  };

  toReset = () => {
    this.setState({
      activeForm: <ResetPassword toLogin={this.toLogin}/>
    });
  };

  toValidate = (email, token) => {
    this.setState({
      activeForm: (
        <Validate
          useremail={email}
          userToken={token}
          userValidated={this.toSuccess}
        />
      )
    });
  };

  toLogin = (showPasswordResetSuccessSnack) => {
    if(showPasswordResetSuccessSnack){
      this.openSnack = true;
    }
    this.setState({
      activeForm: (
        <LoginForm resetPassword={this.toReset} login={this.loginToApp} />
      )
    });
  };

  closeSnack = () => {
    this.openSnack = false;
  }

  render() {
    const { classes } = this.props;

    if (this.state.loginResult) {
      localStorage.setItem("auth", true);
      localStorage.setItem("s3AccessKey", this.accessKey);
      localStorage.setItem("s3SecretKey", this.secretKey);
      return <Layout history={this.props.history} />;
    }
    return (
      <div className={"container"}>
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <div className={"signupForm"}>
          <div className={"signupCard"}>{this.state.activeForm}</div>
          { this.openSnack && <SnackBar clear={this.closeSnack} result={this.resultMessage} variant={this.variant} close={this.closeSnack}/> }
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(Auth);
