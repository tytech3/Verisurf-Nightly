import React, { Component } from 'react';
import './TestPage.css';
import VerisurfCard from '../components/verisurfCard.js';
import Grid from "@material-ui/core/Grid";
import HttpRequest from '../utilities/HttpRequest.js';

class TestPage extends Component {
    
    constructor(props){

        super(props);

        this.state ={
            cardArray: [],
            maxNightly: 10,
            prevArray: [],
            skeletonArray: []
        }
    }

    componentWillMount(){
        var max = localStorage.getItem('maxNightly');
        if(max != null && !isNaN(parseInt(max))){
          this.setState({maxNightly: max})
        }
     
      var index  = 0
      var skeleton = []
      for(index; index < 15; index += 1){
        skeleton.push(
          <Grid item md={10} style={{alignContent: 'center', alignItems: 'center', justifyContent: 'center'}} key={index}>
            <VerisurfCard
              type={'skeleton'}
              />
          </Grid>
        )
      }

      this.setState({skeletonArray: skeleton})
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
        var innerjson = json[index]
        var versionKey = Object.keys(innerjson)
        localCardArray.push(
          <Grid item md={10} style={{alignContent: 'center', alignItems: 'center', justifyContent: 'center'}} key={index}>
            <VerisurfCard
              type={'content'}
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
      localStorage.setItem("cardAmount", localCardArray.length)
    }

    componentDidMount = () => {
        this.props.onRef(this)
        this.props.clearBadge();
        HttpRequest('/nightly/'+this.state.maxNightly).then(result => {
          this.setUpData(result)
      }, err => console.log(err))
        
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
                  {this.state.prevArray.length === 0 ? this.state.skeletonArray : this.state.cardArray}
              </Grid>
            </div>
          </div>
        );
    }
}

export default TestPage