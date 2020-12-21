import React, { Component } from 'react';
import { Row, Col, Badge } from 'antd';
import Chart from "react-apexcharts";
import axios from 'axios';

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        chart: {
          id: "basic-bar"
        },
        // fill: {
        //   type: "gradient",
        //   gradient: {
        //     shadeIntensity: 1,
        //     opacityFrom: 0.7,
        //     opacityTo: 0.9,
        //     stops: [0, 90, 100]
        //   }
        // },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: ["01 Jan",
          "02 Jan",
          "03 Jan",
          "04 Jan",
          "05 Jan",
          "06 Jan",
          "07 Jan"
          ]
        },
        stroke: {
          curve: 'smooth',
        }
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70]
        },
        {
          name: 'series2',
          data: [11, 32, 45, 32, 34, 52, 41]
        }
      ],
      options2: {
        legend: {
          show: false,
        },
        plotOptions: {
          pie: {
            customScale: 0.8,
            donut: {
              size: '80%',
              labels: {
                show: false
              }
            }
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
      series2: [44, 55, 41, 17, 15],
      labels2: ['A', 'B', 'C', 'D', 'E'],

      options3: {
          chart: {
            height: 350,
            type: 'line',
            zoom: {
              enabled: false
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: [5, 7, 5],
            curve: 'straight',
            dashArray: [0, 8, 5]
          },
          legend: {
            tooltipHoverFormatter: function(val, opts) {
              return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
            }
          },
          markers: {
            size: 0,
            hover: {
              sizeOffset: 6
            }
          },
          xaxis: {
            categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
              '10 Jan', '11 Jan', '12 Jan'
            ],
          },
          tooltip: {
            y: [
              {
                title: {
                  formatter: function (val) {
                    return val + " (mins)"
                  }
                }
              },
              {
                title: {
                  formatter: function (val) {
                    return val + " per session"
                  }
                }
              },
              {
                title: {
                  formatter: function (val) {
                    return val;
                  }
                }
              }
            ]
          },
          grid: {
            borderColor: '#f1f1f1',
          }
      },
      series3: [{
        name: "Session Duration",
        data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
      },
      {
        name: "Page Views",
        data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
      },
      {
        name: 'Total Visits',
        data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
      }
    ],
    };
  }

  UNSAFE_componentWillMount() {
    
  }

  componentDidMount() {
    let params = {
      tid: "JqnXRg9HPQ9W",
      domain: "localhost:1998",
      // period: "unique_user_online"
      spec: "unique_user_online"
    }
    axios.get(`api/private/analytics`, params)
    .then(res => {
      console.log(res, "get analytics")
      
    })

  }

  render() {
    return <div>
    <Row>
      <Col span={16} className="pd-10">
        <div className="table-card">
          <div className="card-title">Traffic</div>
          <Chart
            options={this.state.options}
            series={this.state.series}
            type="area"
            width="100%"
          />
        </div>
      </Col>
      <Col span={8} className="pd-10">
        <div className="table-card">
          <div className="card-title">Device</div>
          <Chart options={this.state.options2} series={this.state.series2} type="donut" width="100%" />
          <table className="wc-table">
            <thead className="wc-thead">
              <tr>
                <th>Device</th>
                <th>Access count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><Badge status="success" />Mobile</td>
                <td>201</td>
              </tr>
              <tr>
                <td><Badge status="processing" />Tablet</td>
                <td>199</td>
              </tr>
              <tr>
                <td><Badge status="warning" />Desktop</td>
                <td>250</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span={12} className="pd-10">
        <div className="table-card">
          <div className="card-title">Traffic by channel</div>
          <Chart
            options={this.state.options3}
            series={this.state.series3}
            type="line"
            width="100%"
          />
        </div>
      </Col>
    </Row>
  </div>
  }
  
}

export default Analytics;