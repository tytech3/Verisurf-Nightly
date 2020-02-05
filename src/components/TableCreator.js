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
    var info = props.props.props
    var listArray= [];
    var iconArray = [<FolderOpenIcon />, <AssessmentIcon />, <StorageIcon />]

    let i = 0;
    for(var item in info){


        
        if(i === 3){
            break;
        }

        var resultIcon;
        if(info[item] === 1){
            resultIcon = <CheckCircleIcon style={{color: 'green'}} />
        }
        else{
            resultIcon = <CancelIcon style={{color: 'red'}} />
        }

        switch(item){
            case 'fileopen':
                item = "File - Open"
                break
            case 'analysis':
                item = "Analysis Summary"
                break
            case "database":
                item = "Database Validation"
                break;
            default:
                item="error parsing item"
                break;
        }

        listArray.push(
            <ListItem key={item} >
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
                        <ListItemText primary={info['timeelapsed']} />
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <QueryBuilderIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={info['timestamp']} />
                    </ListItem>
                </List>
            </div>
        </Grid>
    )
}

