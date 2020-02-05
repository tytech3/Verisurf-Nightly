import React, { Component } from 'react';
import './TestPage.css';
import VerisurfCard from '../components/verisurfCard.js';
import AWS from 'aws-sdk';
import Grid from "@material-ui/core/Grid";
import HttpRequest from '../utilities/HttpRequest.js';

AWS.config.update({
  accessKeyId: localStorage.getItem('s3AccessKey'),
  secretAccessKey: localStorage.getItem('s3SecretKey')
})
class TestPage extends Component {
    
    constructor(props){

        super(props);

        this.state ={
            cardArray: [],
            maxNightly: 20,
            prevArray: [],
        }
    }

    componentWillMount(){
      try{
        var max = localStorage.getItem('maxNightly');
        this.setState({maxNightly: max});
      }
      catch(e){
        console.log("no setting found.");
      }
    }


    componentWillUnmount(){
      this.props.onRef(undefined);
    }

    setUpData = (data) => {
      var json = JSON.parse(data)
      var localCardArray = []
      var index = json.length -1
      localStorage.setItem('recentBuild', Object.keys(json[index]))
      while(index > -1){
        if(index > this.state.maxNightly){break}
        var innerjson = json[index]
        var versionKey = Object.keys(innerjson)
        localCardArray.push(
          <Grid item md={10} style={{alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
            <VerisurfCard 
              props={innerjson[versionKey]} 
              name={versionKey} 
              onClick={this.props.install} 
              result={!(innerjson[versionKey]['fileopen'] && innerjson[versionKey]['analysis'] && innerjson[versionKey]['database'])} 
              disable={this.props.disableInstall} />
          </Grid>
          )
        index -= 1
      }
      this.setState({cardArray: localCardArray, prevArray: localCardArray})
    }

    componentDidMount = () => {
        this.props.onRef(this)
        this.props.clearBadge();

        HttpRequest('/nightly').then(result => {
          this.setUpData(result)
      }, err => console.log(err))
        
      /*
        var s3 = new AWS.S3();
        var params ={
            Bucket: 'vs2020',
            Key: 'nightly/UT Results/UTR.json',
        }
        var that = this;
        s3.getObject(params, function(err, data){
            if(err) {console.log(err, err.stack);}
            else {
                var response = new TextDecoder('utf-8').decode(data.Body)
                var json = JSON.parse(response)
                var localCardArray = [];
                var i = 0;
                localStorage.setItem('recentBuild', Object.keys(json)[0]);
                for(var item in json){
                    if(i > that.state.maxNightly){
                      break;
                    }
                    var testResult = false;
                    for(var atr in json[item]){
                        if(atr['fileopen'] === 0 || atr['analysis'] === 0 || atr['database'] === 0){
                          testResult = true;
                          break;
                        }
                  }
                  localCardArray.push(
                    <Grid item md={10} style={{alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
                      <VerisurfCard props={json[item]} name={item} onClick={that.props.install} result={testResult} disable={that.props.disableInstall} />
                    </Grid>
                    )
            }
            that.setState({cardArray: localCardArray, prevArray: localCardArray})
          }
        }) 
        */
      }

  searchBuild = (str) => {
    var result = this.state.prevArray.filter(card => card.props.children.props.name[0].startsWith(str));
    this.setState({cardArray: result})
  }

    render() {
        return (
          <div style={{height: '100%', width: '100%'}}>
            <div className={'cards'}>
              <div className={'downloadText'}><p id={'currentDownload'}>{this.state.currentDownload}</p></div>
                <Grid container spacing={5} style={{alignItems: 'center', alignContent: 'center', justifyContent: 'center'}}> 
                  {this.state.cardArray}
              </Grid>
            </div>
          </div>
        );
    }
}

export default TestPage