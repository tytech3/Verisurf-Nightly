import React, { Component } from 'react';
import './Settings.css';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import config from '../../package.json';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Button } from '@material-ui/core';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
const {ipcRenderer} = window.require('electron');

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
            amt: 10,
            active: ["pickerItem", "pickerItem", "pickerItem"]
        }   
    }

    componentWillMount(){
        try{
            var maximum = localStorage.getItem('maxNightly');
            maximum = parseInt(maximum)
            this.setState({amt: maximum});
        }
        catch(e){
            this.setState({amt: 10})
        }

    }

    handleChange = (event) => {
        localStorage.setItem('maxNightly', event.target.value);
        this.setState({amt: event.target.value})
    }

    checkUpdate = () => {
        ipcRenderer.send("checkUpdate")
    }

    test = num => {
        var newActive = ["pickerItem", "pickerItem"];
        newActive[num] = "selectedItem";
        this.setState({ active: newActive });

        localStorage.setItem("startPage", num)
      };

      componentDidMount= () => {
        var newActive = ["pickerItem", "pickerItem"];
        var x = localStorage.getItem("startPage")
        if(x === '0' || x === '1'){
            newActive[x] = "selectedItem";
            this.setState({ active: newActive });
        }
        else{
            newActive[0] = "selectedItem"
            this.setState({active: newActive})
        }
      }

    render() {
        const {classes} = this.props;
        return (
            <div className={'settingsLayout'}>                               
                <div className={'settingsHeader'}>
                    <Typography variant={'h4'}>
                        Nightly
                    </Typography>
                    <Divider variant={'fullwidth'}/>
                </div>
                
                <div className={'optionsContainer'}>
                    <div className={'optionsHeader'}>
                        <Typography variant={'subtitle1'} style={{fontSize: '1rem'}}>
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



                <div className={'settingsHeader'} style={{marginTop: '1rem'}}>
                <Typography variant={'h4'}>
                    App
                </Typography>
                <Divider />
            </div>
            
            <div className={'optionsContainer'}>
                <div className={'optionsHeader'}>
                    <Typography variant={'subtitle'} style={{fontSize: '1rem'}}>
                        Start Page
                    </Typography>
                </div>

                <div className="SegmentedPicker">
                <div className={this.state.active[0]} onClick={() => this.test(0)}>
                    <Typography>Home</Typography>
                </div>
                <div className={this.state.active[1]} onClick={() => this.test(1)}>
                    <Typography>Nightly</Typography>
                </div>
              </div>        
            </div>


                <div className={'settingsFooter'}>
                    <div className={'settingsFooterInfo'}>
                        <Typography variant="body2">
                            Version: {config.version}
                        </Typography>
                        <Typography variant="caption">
                            Verisurf Software {'\u00A9'} 2020
                        </Typography>
                    </div>

                <div style={{position: 'fixed', bottom: 2, right: 0}}>
                    <Button
                        onClick={this.checkUpdate}
                        variant="contained"
                        startIcon={<SystemUpdateAltIcon />}>
                        Check For Updates
                    </Button>
                </div>

                </div>
            </div>
        );
    }
}

export default withStyles(styles, {withTheme: true})(Settings);