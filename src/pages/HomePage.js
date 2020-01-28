import React from 'react';
import './HomePage.css';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ApexChart from '../components/ApexChart.js';
import { withStyles } from "@material-ui/core/styles";
import Fade from 'react-reveal/Fade';


const styles = theme => ({

    root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
          margin: theme.spacing(1),
          width: theme.spacing(16),
          height: theme.spacing(16),
        },
        flexDirection: 'column',
        marginTop: 'auto',
        marignBottom: '5rem',
        textAlign: 'center',
        
      },
      paper: {
        height: "10rem",
        width: "22rem",
        margin: "2rem",
        marginTop: "0rem",
        textAlign: 'center',
        alignContent: 'center',
      },
      paperHolder: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: '15%',
      },

      headerBar:{
          width: '45%',
          height: '3rem',
          backgroundImage: 'linear-gradient(75deg, #ED1C5F, #FD6307)',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '25px',
          alignSelf:'center',
          marginBottom: '4rem'
      }
});

class HomePage extends React.Component {

    constructor(props){
        super(props);
        this.state={
            cardArray: []
        }
    }

    componentDidMount = () => {
           
    }


    render() {
        const{classes} = this.props;
        return (
            <div className={'mainOverlay'}>
            <Fade>
                <div className={classes.paperHolder}>
                <Paper elevation={3} className={classes.paper} style={{backgroundImage: 'linear-gradient(75deg, #20DBDB, #5685E6)'}}>
                   <Typography variant="h2" style={{color: 'white', textAlign: 'center', marginTop: '2rem'}}>
                        {this.props.totalNightly}
                    </Typography>
                    <Typography variant="h5" style={{color: 'white', textAlign: 'center', marginTop: '0rem'}}>
                        {new Date().getFullYear()} Nightlys
                    </Typography>
                </Paper>
                <Paper elevation={3} className={classes.paper} style={{backgroundImage: 'linear-gradient(75deg, #F5509F, #FE717A)'}}>
                    <Typography variant="h2" style={{color: 'white', textAlign: 'center', marginTop: '2rem'}}>
                        {this.props.totalWeekly}
                    </Typography>
                    <Typography variant="h5" style={{color: 'white', textAlign: 'center', marginTop: '0rem'}}>
                        This Week
                    </Typography>
                </Paper>
                <Paper elevation={3} className={classes.paper} style={{backgroundImage: 'linear-gradient(75deg, #3CE592, #3BB6B4)'}}>
                    <Typography variant="h2" style={{color: 'white', textAlign: 'center', marginTop: '2rem'}}>
                       {this.props.latestBuild}
                    </Typography>
                    <Typography variant="h5" style={{color: 'white', textAlign: 'center', marginTop: '0rem'}}>
                       Latest Build
                    </Typography>
                </Paper>


                
                </div>
                </Fade>
                <div style={{marginTop: 'auto', marginBottom: '2rem', marignLeft: '5%', marignRight: '5%', backgroundColor: '#FFFFFF', borderRadius: '3%'}}>
                    <ApexChart graphDataPassing={this.props.graphDataPassing} graphDataFailing={this.props.graphDataFailing} />
                </div>
            </div>
        );

    }
}

export default withStyles(styles, {withTheme: true})(HomePage);

