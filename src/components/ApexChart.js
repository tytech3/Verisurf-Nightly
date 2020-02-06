import React from 'react';
import ReactApexChart from 'react-apexcharts';

export default class ApexChart extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        series: [{
          name: 'Passing Builds',
          data: this.props.graphDataPassing
        }, {
          name: 'Failing Builds',
          data: this.props.graphDataFailing
        }, ],
        options: {
          chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            stackType: '100%',
          },
          colors: ['#008FFB', '#FD5300'],
          responsive: [{
            breakpoint: 480,
            options: {
            }
          }],
          xaxis: {
            categories: ['2020 Q1', '2020 Q2', '2020 Q3', '2020 Q4'],
          },
          fill: {
            opacity: 1,
            colors:['#008FFB', '#FD5300']
          },
          legend:{
            show: true,
            showForSingleSeries: true,
            showForNullSeries: true,
            showForZeroSeries: true,
            position: 'bottom'
          }
        },    
      };
    }
  
    render() {
      return (    
        <div id="chart">
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />
        </div>
      );
    }
  }
