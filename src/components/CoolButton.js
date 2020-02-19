import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import PostRequest from "../utilities/PostRequest.js";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function CircularIntegration(props) {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

 

  const handleButtonClick = () => {
    console.log(props.body)
    var x = JSON.parse(props.body)
    if(x.Password !== undefined){
      //there is a password field here.
      if(x.Password === ""){
        props.Fail("Empty")
        return
      }
      if(x.Confirm === ""){
        props.Fail("Empty")
        return
      }
      if(x.Password !== x.Confirm){
        props.Fail("notEqual")
        return
      }
    }
    if (!loading) {
      console.log(props.body)
      setSuccess(false);
      setLoading(true);
      PostRequest(props.uri, props.body).then(resolve =>{
        console.log("RESOLVE: " + resolve)
        setSuccess(true)
        setLoading(false)
        props.Success()
      }, reject => {
        console.log("REJECT: " + reject)
        props.Fail(reject)
        setSuccess(false)
        setLoading(false)
        props.Fail()
      })
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Button
          variant="contained"
          color="primary"
          className={buttonClassname}
          disabled={loading}
          onClick={handleButtonClick}
        >
          Submit
        </Button>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    </div>
  );
}