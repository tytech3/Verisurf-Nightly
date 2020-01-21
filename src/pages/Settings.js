import React, { Component } from 'react';
import './Settings.css';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import config from '../../package.json';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      marginLeft: '3rem'
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  });
  



class Settings extends Component {

    constructor(props){
        super(props);

        this.state={
            amt: 20
        }   
    }


    componentWillMount(){
        try{
            var maximum = localStorage.getItem('maxNightly');
            maximum = parseInt(maximum)
            this.setState({amt: maximum});
        }
        catch(e){
            console.log('there is no local storage.');
        }
    }
//test

    handleChange = (event) => {

        localStorage.setItem('maxNightly', event.target.value);
        this.setState({amt: event.target.value})
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={'settingsLayout'}>
                <div className={'settingsHeader'}>
                    <Typography variant={'h3'}>
                        Nightly
                    </Typography>
                    <Divider variant={'fullwidth'}/>
                </div>
                
                <div className={'optionsContainer'}>
                    <div className={'optionsHeader'}>
                        <Typography variant={'overline'} style={{fontSize: '1rem'}}>
                            Max Nightly's Displayed
                        </Typography>
                    </div>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Max Displayed</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={this.state.amt}
                            onChange={this.handleChange}
                            >
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                                <MenuItem value={150}>150</MenuItem>
                                <MenuItem value={200}>200</MenuItem>
                            </Select>
                    </FormControl>
                </div>
                <div style={{marginTop: 'auto'}}>
                    <Typography>
                        VersionX: {config.version}
                    </Typography>
                </div>
            </div>
        );
    }
}

export default withStyles(styles, {withTheme: true})(Settings);