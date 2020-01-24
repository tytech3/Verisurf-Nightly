import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, CardActions, 
         Collapse, IconButton, Button } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GetAppIcon from '@material-ui/icons/GetApp';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { red } from '@material-ui/core/colors';
import TableCreator from './TableCreator.js';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

    const useStyles = makeStyles(theme => ({
        card: {
          maxWidth: '100%',
          margin: '1%',
          padding: '5px',
        },
        cardHeader: {
            display: 'flex',
            padding: '8px',
            alignItems: 'center',
        },
        headerText:{
            fontSize: '1.1rem',
            fontWeight: 'bolder',
        },
        subHeaderText:{
          fontSize: '1.0rem',
          fontWeight: 'lighter',
          marginLeft: '25px'
        },
        headerIcon: {
            alignSelf: 'flex-end',
            color: 'green',
            marginLeft: 'auto',
            padding: '12px',
            flex: (0,0,'auto'),
            display: 'inline-flex',
            position: 'relative',
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: 'auto',
            overflow: 'visible'
        },
        media: {
          height: 0,
          paddingTop: '56.25%', // 16:9
        },
        expand: {
          transform: 'rotate(0deg)',
          marginLeft: 'auto',
          transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
          }),
        },
        expandOpen: {
          transform: 'rotate(180deg)',
        },
        avatar: {
          backgroundColor: red[500],
        },
        button: {
            margin: theme.spacing(1),
            fontSize: 20,
          },
        tables: {

          maxWidth: '100%',
        },

      }));
      

function VerisurfCard(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    function handleClose(){
      setOpen(false);
    }

    function callParentMethod(){
      //this is how you tell if the build is failed or not.
      //the icon would be secondary color if failed. 
      //so we can open dialog to ensure user wants to download the fail file.
      if(props.result === true){
        setOpen(true);
      }
      else{
        props.onClick(props.name);
        //props.name = version pressed.
        //ipcRenderer.send("downloadDir", props.name);
        //ipcRenderer.send("downloaderPercentage")
      }
    }

    
    function callParentMethod2(){
      props.onClick(props.name);
      setOpen(false)
    }

    return (
      <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Install failed version?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The version you are trying to install failed one or more unit tests.
            Are you sure you want to install this file?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={callParentMethod2} color="primary" autoFocus>
            Install
          </Button>
        </DialogActions>
      </Dialog>

    <Card className={classes.card}>
        <CardContent className={classes.cardHeader}>
            <Typography className={classes.headerText}>Build {props.name}</Typography>
            <Typography className={classes.subHeaderText}>{props.props.timestamp}</Typography>
            {props.result ? <CancelIcon className={classes.headerIcon} color="secondary" /> : <CheckCircleIcon className={classes.headerIcon} color="primary"/> }
        </CardContent>
        <CardContent>
            <Button
                onClick={callParentMethod}
                variant="contained"
                color="secondary"
                className={classes.button}
                endIcon={<GetAppIcon/>}>
                Install
                </Button>
        </CardContent>
        <CardActions disableSpacing>
            <IconButton className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
            })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more">
                <ExpandMoreIcon />
            </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent className={{media: classes.tables}}>
                <TableCreator props={props}/>
            </CardContent>
        </Collapse>
    </Card>
    </>
    )
}

export default VerisurfCard
