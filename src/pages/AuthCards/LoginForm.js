import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LockIcon from "@material-ui/icons/Lock";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LoginRequest from "../../utilities/LoginRequest.js";
import Checkbox from '@material-ui/core/Checkbox';
import "./LoginForm.css";
const {ipcRenderer} = window.require('electron');

export default class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.pass = "";
    this.user = "";

    this.state = {
      loginError: false,
      loginHelperText: "",
      rememberMe: false
    };
  }

  componentDidMount(){
    try{
      this.user=localStorage.getItem("userName")
      this.pass=localStorage.getItem("pass")
      this.setState({rememberMe: true})
    }
    catch(error){
      //nothing here.
    }
  }

  loginToApp = () => {
    LoginRequest(this.user, this.pass).then(
      resolve => {
        if(this.state.rememberMe){
          localStorage.setItem("userName", this.user)
          localStorage.setItem("pass", this.pass)
        }
        console.log("RESOLVE: " + resolve);
        this.props.login();
      },
      reject => {
        console.log("REJECT: " + reject);
        this.setState({
          loginError: true,
          loginHelperText: "Invalid credentials. Please try again."
        });
      }
    );
  };

  rememberMeClick = (value) => {
    this.setState({rememberMe: value})
  }

  render() {
    return (
      <React.Fragment>
        <div className="loginHeader">
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
            Verisurf Nightly
          </Typography>
        </div>

        <div className="loginForms">
          <TextField
            label="Username"
            onChange={event => {
              this.user = event.target.value;
            }}
            style={{ marginLeft: "10%", marginRight: "10%" }}
            error={this.state.loginError}
            helperText={this.state.loginHelperText}
            value={this.user}
            onFocus={() => {
              this.setState({ loginError: false, loginHelperText: "" });
            }}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Password"
            style={{ marginLeft: "10%", marginRight: "10%", marginTop: "10%" }}
            variant="outlined"
            value={this.pass}
            type="password"
            onChange={event => {
              this.pass = event.target.value;
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              )
            }}
          />
        </div>
        <div className={"loginButton"}>
          <Button
            style={{ marginTop: "10%", marginLeft: "10%", marginRight: "10%" }}
            variant="contained"
            color="primary"
            disableElevation
            onClick={this.loginToApp}
          >
            Login
          </Button>
          {/*<Button
          style={{ marginTop: "3%", marginLeft: "10%", marginRight: "10%" }}
          variant="contained"
          color="secondary"
          disableElevation
          onClick={() => {
            this.props.toSignup();
          }}
        >
          Sign up
        </Button> */}

          <div className={"forgotSignup"}>
            <div className={"seperator"}>
                <Typography
                color="primary"
                style={{ cursor: "pointer", fontWeight: "light" }}
                onClick={() => {
                  this.props.resetPassword();
                }}
              >
                Reset Password
              </Typography>
            </div>
            <div className={"seperator"}>
              <Checkbox
                checked={this.state.rememberMe}
                onChange={(event) => {this.rememberMeClick(event.target.value)}}
                inputProps={{ 'aria-label': 'primary checkbox' }} />
              <Typography
              color="Primary"
              style={{fontWeight: "light", cursor: "pointer" }}
              onClick={() => {
                this.rememberMeClick(!this.state.rememberMe)
              }}
              >
              Remember me
            </Typography>
        </div>

          </div>
        </div>
      </React.Fragment>
    );
  }
}
