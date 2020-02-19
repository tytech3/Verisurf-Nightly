import React, { Component } from "react";
import "./Auth.css";
import Layout from "../Layout.js";
import SnackBar from "../components/SnackBar.js";
import SignUp from "./AuthCards/SignUp.js";
import Validate from "./AuthCards/Validate.js";
import LoginForm from "./AuthCards/LoginForm.js";
import Success from "./AuthCards/Success.js";
import ResetPassword from "./AuthCards/ResetPassword.js";


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
    if (this.state.loginResult) {
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

export default Auth;
