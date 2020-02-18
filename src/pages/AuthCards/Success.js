import React, { Component } from 'react'
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';
import './Success.css'

export default class Success extends Component {
    render() {
        return (
            <React.Fragment>
            <div className={"successHeader"}>
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
            Success!
          </Typography>
            </div>
            <div className={"successSub"}>
                <Typography style={{marginLeft: "10%", marginRight: "10%"}}>
                    Your account has been created.
                </Typography>
            </div>
            <div style={{marginTop: "5%"}}>
            <Typography color="Primary" style={{cursor: "pointer"}}>
                Click here to login with your credentials.
            </Typography>
            </div>
            </React.Fragment>
        )
    }
}
