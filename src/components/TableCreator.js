import React from 'react';
import { Grid, List, ListItemText, ListItem, ListItemSecondaryAction, ListItemAvatar, Avatar, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import AssessmentIcon from '@material-ui/icons/Assessment';
import StorageIcon from '@material-ui/icons/Storage';
import TimerIcon from '@material-ui/icons/Timer';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';


const useStyles = makeStyles(theme => ({
    table: {
      maxWidth: '100%',
    },

  }));


export default function TableCreator(props) {

    const classes = useStyles()
    var props = props.props.props
    var listArray= [];
    var iconArray = [<FolderOpenIcon />, <AssessmentIcon />, <StorageIcon />]

    let i = 0;
    for(var item in props){
        
        if(i == 3){
            break;
        }

        var resultIcon;
        if(props[item] == 1){
            resultIcon = <CheckCircleIcon style={{color: 'green'}} />
        }
        else{
            resultIcon = <CancelIcon style={{color: 'red'}} />
        }

        listArray.push(
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        {iconArray[i]}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item} />
                <ListItemSecondaryAction>
                    <IconButton style={{marginLeft: "25px"}}edge="end" aria-label="pass" disabled>
                        {resultIcon}
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        )

       i +=1;
    }


//test

    return (
        <Grid item xs={12} md={6} className={classes.table}>
            <div>
                <List>
                    {listArray}
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <TimerIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={props['timeelapsed']} />
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <QueryBuilderIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={props['timestamp']} />
                    </ListItem>
                </List>
            </div>
        </Grid>
    )
}

