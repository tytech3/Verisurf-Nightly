import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CoolButton from '../../components/CoolButton.js';
import './Validate.css'

export default class Validate extends Component {
  constructor(props){
    super(props);
    this.userInput = ""
    this.state = {
      validated: false
    }
  }

  valid = (event) => {
    this.userInput = event.target.value
  }

  testValidation = () => {
    if(this.userInput == this.props.userToken){
      //validated
    }
    else{
      //failed
    }
  }

  render() {
    return (
      <React.Fragment>
        <div style={{marginTop: '15%'}}>
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
            Validation Pending
          </Typography>
          <Typography
          color="secondary"
          style={{
            fontSize: ".7.0rem",
            color: "black",
            fontWeight: "light",
            letterSpacing: 2,
            marginLeft: '5%',
            marginRight: '5%'
          }}
          variant="overline"
          display="block"
          gutterBottom
        >
          A validation code was sent to your email at {this.props.useremail}
          
        </Typography>
        <Typography
        color="secondary"
        style={{
          fontSize: ".7.0rem",
          color: "black",
          fontWeight: "light",
          letterSpacing: 2,
          marginLeft: '5%',
          marginRight: '5%'
        }}
        variant="overline"
        display="block"
        gutterBottom
      >
        Please copy and paste the code below.
        
      </Typography>

        </div>

        <div className={"inputCode"}>
            <TextField
            style={{width: "75%"}}
            variant="outlined"
            label="Validation Code"
            inputProps={{maxLength: 6}}
            onChange={this.valid}
            />

            <CoolButton onClick={this.testValidation}/>
        </div>
      </React.Fragment>
    );
  }
}
