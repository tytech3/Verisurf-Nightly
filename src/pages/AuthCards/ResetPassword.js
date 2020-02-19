import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import CoolButton from "../../components/CoolButton.js";
import Collapse from "@material-ui/core/Collapse";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import LockIcon from "@material-ui/icons/Lock";
import "./ResetPassword.css";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.email = "";
    this.pass = "";
    this.codeHelper = "";
    this.state = {
      test1: true,
      test2: false,
      userEmail: "",
      userToken: "",
      emailSubmit: true,
      codeSubmit: false,
      changePass: false,
      password: "",
      confirmPass: "",
      codeError: false,
      confirmPassError: false,
      confirmPassHelper: ""
    };
  }

  fail = () => {
    //do something when
    //post request fails
    //gonna go ahead and redirect them to code entry anyways.
    //i do this as to not reveal if the email exists in our system or not.
    this.setState({ emailSubmit: false, codeSubmit: true });
  };

  success = () => {
    //do something when
    //post request succeeds
    this.setState({ emailSubmit: false, codeSubmit: true });
  };

  successCode = () => {
    //user successfully entered code
    this.setState({ codeSubmit: false, changePass: true });
  };

  failCode = () => {
    this.codeHelper = "Ooops! Looks like that code didn't work.";
    this.setState({ codeError: true });
  };

  successPass = () => {
    var showSuccessMessage = true
    this.props.toLogin(showSuccessMessage)
  };

  failPass = error => {
    if (error === "notEqual") {
      this.setState({confirmPassHelper: "Passwords do not match.", confirmPassError: true})
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="resetHeader">
          <Typography
            color="secondary"
            style={{
              fontSize: "2.0rem",
              color: "black",
              fontWeight: "lighter",
              letterSpacing: 5
            }}
            variant="overline"
            display="block"
            gutterBottom
          >
            Reset Password
          </Typography>
        </div>
        <div className={"textBox"}>
          <Collapse in={this.state.emailSubmit}>
            <Typography variant={"subtitle1"} style={{ margin: "5%" }}>
              Enter the email for the account you wish to reset.
            </Typography>
            <div className={"textAndButton"}>
              <TextField
                label="Email"
                onChange={event => {
                  var x = JSON.stringify({ Email: event.target.value });
                  this.email = event.target.value;
                  this.setState({ userEmail: x });
                }}
                style={{ marginLeft: "10%", marginRight: "10%" }}
                onFocus={() => {}}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon />
                    </InputAdornment>
                  )
                }}
              />
              <CoolButton
                uri={"resetter"}
                body={this.state.userEmail}
                Success={this.success}
                Fail={this.fail}
              />
            </div>
            <div className={"backToLogin"}>
              <Typography
                style={{ cursor: "pointer" }}
                color="primary"
                onClick={() => {
                  this.setState({
                    emailSubmit: false,
                    codeSubmit: false,
                    changePass: false
                  });
                  this.props.toLogin();
                }}
              >
                Back to Login
              </Typography>
            </div>
          </Collapse>

          <Collapse in={this.state.codeSubmit} timeout={500}>
            <Typography variant={"subtitle1"} style={{ margin: "5%" }}>
              Enter the code sent to your email.
            </Typography>
            <div className={"textAndButton"}>
              <TextField
                label="Code"
                error={this.state.codeError}
                helperText={this.codeHelper}
                onChange={event => {
                  var x = JSON.stringify({
                    Email: this.email,
                    Token: event.target.value
                  });
                  this.setState({ userToken: x });
                }}
                style={{ marginLeft: "10%", marginRight: "10%" }}
                onFocus={() => {
                  this.helperText = "";
                  this.setState({ codeError: false });
                }}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon />
                    </InputAdornment>
                  )
                }}
              />
              <CoolButton
                uri={"resetcode"}
                body={this.state.userToken}
                Success={this.successCode}
                Fail={this.failCode}
              />
            </div>
            <div className={"backToLogin"}>
              <Typography
                style={{ cursor: "pointer" }}
                color="primary"
                onClick={() => {
                  this.setState({
                    emailSubmit: false,
                    codeSubmit: false,
                    changePass: false
                  });
                  this.props.toLogin();
                }}
              >
                Back to Login
              </Typography>
            </div>
          </Collapse>

          <Collapse in={this.state.changePass} timeout={500}>
            <Typography variant={"subtitle1"} style={{ margin: "5%" }}>
              You may now change your password.
            </Typography>
            <div className={"confirmPass"}>
              <TextField
                label="New Password"
                error={this.state.confirmPassError}
                onChange={event => {
                  this.pass = event.target.value;
                }}
                style={{ marginLeft: "10%", marginRight: "10%" }}
                onFocus={() => {
                  this.setState({
                    confirmPassError: false,
                    confirmPassHelper: ""
                  });
                }}
                type={"password"}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                label="Confirm New Password"
                error={this.state.confirmPassError}
                helperText={this.state.confirmPassHelper}
                onChange={event => {
                  var x = JSON.stringify({
                    Email: this.email,
                    Password: event.target.value,
                    Confirm: this.pass
                  });
                  this.setState({ confirmPass: x });
                }}
                style={{ marginLeft: "10%", marginRight: "10%" }}
                onFocus={() => {
                  this.setState({
                    confirmPassError: false,
                    confirmPassHelper: ""
                  });
                }}
                type={"password"}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  )
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-end",
                  marginRight: "10%"
                }}
              >
                <CoolButton
                  uri={"resetpassword"}
                  body={this.state.confirmPass}
                  Success={this.successPass}
                  Fail={this.failPass}
                />
              </div>
            </div>
            <div className={"backToLogin"}>
              <Typography
                style={{ cursor: "pointer" }}
                color="primary"
                onClick={() => {
                  this.setState({
                    emailSubmit: false,
                    codeSubmit: false,
                    changePass: false
                  });
                  this.props.toLogin();
                }}
              >
                Back to Login
              </Typography>
            </div>
          </Collapse>
        </div>
      </React.Fragment>
    );
  }
}

export default ResetPassword;
