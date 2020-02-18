import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import "./SignUp.css";

var randtoken = require('rand-token').generator({
    chars: '0-9'
})
var token;

export class SignUp extends Component {
  constructor(props) {
    super(props);
    //signup variables
    this.suFirstName = "";
    this.suLastName = "";
    this.suEmail = "";
    this.suPassword = "";
    this.suConfirmPassword = "";


    this.state = {
      loginResult: false,
      emailHelper: "",
      passwordHelper: "",
      confirmedPasswordHelper: "",
      firstNameHelper: "",
      lastNameHelper: "",
      emailError: false,
      passwordError: false,
      confirmPasswordError: false,
      fnameError: false,
      lnameError: false,
    };
  }

  signUpClick = () => {
    var passed = true;
    if (!this.validateEmailRegxp()) {
      this.setState({
        emailError: true,
        emailHelper: "Invalid email. Must be verisurf domain."
      });
      passed = false;
    }
    if (!this.validatePasswordRegxp()) {
      this.setState({
        passwordError: true,
        passwordHelper:
          "Password must be minimum of 8 characters with at least 1 number & 1 letter."
      });
      passed = false;
    }
    if (this.suPassword !== this.suConfirmPassword) {
      this.setState({
        confirmPasswordError: true,
        confirmedPasswordHelper: "Passwords do not match."
      });
      passed = false;
    }
    
    if(!this.suFirstName || !this.suLastName){
      if(!this.suFirstName){
        this.setState({
          fnameError: true,
          firstNameHelper: "Field cannot be blank."
        })
      }
      if(!this.suLastName){
        this.setState({
          lnameError: true,
          lastNameHelper: "Field cannot be blank."
        })
      }
    }


    if (passed) {
      //this is a global variable
      token = randtoken.generate(6)
      this.props.toValidate(this.suEmail, token);
      //var didSendRegistration = HttpPOST(token, this.suEmail)
      //console.log(didSendRegistration)
    }
  };

  validatePasswordRegxp = () => {
    var passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordPattern.test(this.suPassword);
  };

  validateEmailRegxp = () => {
    var emailPattern = /^[a-zA-Z0-9._-]+@[v | V]{1}[e|E]{1}[r|R]{1}[i|I]{1}[s|S]{1}[u|U]{1}[r|R]{1}[f|F]{1}\.[c][o][m]$/;
    return emailPattern.test(this.suEmail);
  };

  render() {
    return (
      <React.Fragment>
        <div className={"signupHeader"}>
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
            Sign Up
          </Typography>
        </div>
        <div className={"nameForms"}>
          <TextField
            id="standard-basic"
            label="Firstname"
            error={this.state.fnameError}
            helperText={this.state.firstNameHelper}
            onChange={event => {
              this.suFirstName = event.target.value;
            }}
            onFocus={() => {
              this.setState({ fnameError: false, firstNameHelper: "" });
            }}
          />
          <TextField
            id="standard-basic"
            label="Lastname"
            error={this.state.lnameError}
            helperText={this.state.lastNameHelper}
            onChange={event => {
              this.suLastName = event.target.value;
            }}
            onFocus={() => {
              this.setState({ lnameError: false, lastNameHelper: "" });
            }}
          />
        </div>
        <div className={"restOfForm"}>
          <TextField
            style={{
              marginTop: "3%",
              marginLeft: "3%",
              marginRight: "3%",
              marginBottom: ".1rem"
            }}
            id="standard-basic"
            label="Email"
            error={this.state.emailError}
            helperText={this.state.emailHelper}
            onFocus={() => {
              this.setState({ emailError: false, emailHelper: "" });
            }}
            onChange={event => {
              this.suEmail = event.target.value;
            }}
          />
          <TextField
            type="password"
            style={{
              marginTop: "5%",
              marginLeft: "3%",
              marginRight: "3%",
              marginBottom: ".1rem"
            }}
            id="standard-basic"
            label="Password"
            error={this.state.passwordError}
            helperText={this.state.passwordHelper}
            onFocus={() => {
              this.setState({ passwordError: false, passwordHelper: "" });
            }}
            onChange={event => {
              this.suPassword = event.target.value;
            }}
          />
          <TextField
            type="password"
            style={{ marginTop: "5%", marginLeft: "3%", marginRight: "3%" }}
            id="standard-basic"
            label="Confirm Password"
            error={this.state.confirmPasswordError}
            helperText={this.state.confirmedPasswordHelper}
            onFocus={() => {
              this.setState({
                confirmPasswordError: false,
                confirmedPasswordHelper: ""
              });
            }}
            onChange={event => {
              this.suConfirmPassword = event.target.value;
            }}
          />
        </div>
        <div className={"signupFooter"}>
          <div className={"signupButton"}>
            <Button
              variant="contained"
              color="secondary"
              style={{ paddingLeft: "5rem", paddingRight: "5rem" }}
              onClick={this.signUpClick}
            >
              Sign Up
            </Button>
          </div>
          <div className={"backToLogin"}>
            <Typography style={{ marginRight: "10px" }}>
              Already have an account?
            </Typography>
            <Typography
              color={"secondary"}
              style={{ cursor: "pointer" }}
              onClick={() => {
                this.props.toLogin();
              }}
            >
              {" Login here."}
            </Typography>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SignUp;
