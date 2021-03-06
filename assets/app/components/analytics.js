import React, { Component, useState, useEffect } from 'react';
import { Row, Col, Badge, Select, DatePicker, Space, Popover, Button } from 'antd';
import Chart from "react-apexcharts";
import axios from 'axios';
import { connect } from 'react-redux';
import { FieldTimeOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;


const Analytics = props => {
  const { t } = props
  const [userOnline, setUserOnline] = useState(0)
  const [trafficConfig, setTrafficConfig] = useState({ series: [], options: {} })
  const [deviceConfig, setDeviceConfig] = useState({ series: [], options: {} })
  const [chanelConfig, setChanelConfig] = useState({series: [], options: {}})
  const [desktop, setDesktop] = useState(0)
  const [mobile, setMobile] = useState(0)
  const [tablet, setTablet] = useState(0) 
  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const [appId, setAppId] = useState()
  const [domain, setDomain] = useState()
  const [pageViews, setPageViews] = useState([])

  const buildTrafic = (traffic, users) => {
    return {
      series: [
        {
          name: t('analytics.traffic_data'),
          data: traffic.map(el => el.count)
        },
        {
          name: t('analytics.users'),
          data: users.map(el => el.count)
        }
      ],
      options: {
        chart: {
          // height: 350,
          type: 'area',
          toolbar: {
            show: false
          }
        },
        grid: {
          show: true,
          strokeDashArray: 4,
          borderColor: "#f0f4ff"
        },
        dataLabels: {
          enabled: false
        },
        // stroke: {
        //   width: 2
        // },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        xaxis: {
          type: 'datetime',
          categories: traffic.map(el => el.day)
        },
        yaxis: {
          type: 'number',
          decimalsInFloat: 0,
          labels: {
            formatter: function (value) {
              return parseInt(value)
            }
          }
        },
        tooltip: {
          x: {
            format: 'yy/MM/dd'
          }
        },
      },
    };
  }
  
  const buildDevice = (insight) => {
    setMobile(insight.mobile_count)
    setDesktop(insight.desktop_count)
    setTablet(insight.tablet_count)
    return {
      series: [insight.desktop_count, insight.mobile_count, insight.tablet_count],
      options: {
        legend: {
          show: false,
        },
        labels: ['Desktop', 'Mobile', 'Tablet'],
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
      }
    }
  }

  const buildChannels = data => {
    data = data.sort((prev, next) => prev.day < next.day)
    let facebook = data.map(el => el.data.facebook ? el.data.facebook.count : 0)
    let google = data.map(el => el.data.google ? el.data.google.count : 0)
    let messenger = data.map(el => el.data.messenger ? el.data.messenger.count : 0)
    let direct = data.map(el => el.data.direct ? el.data.direct.count : 0)
    let others = data.map(el => el.data.others ? el.data.others.count : 0)
  
    return {
      series: [
        {
          name: "Facebook",
          data: facebook
        },
        {
          name: "Google",
          data: google
        },
        {
          name: "Messager",
          data: messenger
        },
        {
          name: "Direct",
          data: direct
        },
        {
          name: t('analytics.other'),
          data: others
        }
      ],
      options: {
        chart: {
          toolbar: {
            show: false
          },
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight',
          width: 2
        },
        grid: {
          show: true,
          strokeDashArray: 4,
          borderColor: "#f0f4ff"
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return parseInt(value)
            }
          }
        },
        xaxis: {
          type: 'category',
          categories: data.map(el => el.day),
          hideOverlappingLabels: true,
          labels: {
            formatter: function (value) {
              return moment(new Date(value)).format("MMM DD")
            }
          }
        }
      },
    };
  }

  const datePicker = (
    <div className="date-picker">
    <Space direction="vertical" size={12}>
      <RangePicker
        ranges={{
          Today: [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'd'), moment()],
          '7 days ago': [moment().subtract(7, 'd'), moment()],
          'Last 30 days': [moment().subtract(30, 'd'), moment()],
          'This month': [moment().startOf('month'), moment().endOf('month')],
          'Last month': [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')]
        }}
        onChange={onChangeTime}
        format="YYYY-MM-DD HH:mm:ss"
      />
    </Space>
    <div className="date-tag">

    </div>
    <div className="date-confirm">
      <Button type="primary" onClick={handleConfirmed}>{t('analytics.confirmed')}</Button> 
    </div>
  </div>
  )
    
  useEffect(() => {
    const { apps } = props
    if ( apps.length > 0 ) {
      let tid = apps[0].id
      let domain =  apps[0].domain
      let period = "week"
      setAppId(tid)
      setDomain(domain)
      axios.get(`api/private/analytics?tid=${tid}&domain=${domain}&period=${period}`)
      .then(res => {
        if (res.status == 200) {
          setUserOnline(res.data.unique_user_online)
          setTrafficConfig(buildTrafic(res.data.request_count_by_day, res.data.unique_user_by_week))
          setDeviceConfig(buildDevice(res.data.devices))
          setChanelConfig(buildChannels(res.data.referrers) || [])
          setPageViews(res.data.page_views_by_day)
        }
      })
    }
  }, [])

  const handleChangeApp = (value, opt) => {
    let tid = value
    let domain = opt.children
    let period = "week"
    setAppId(tid)
    setDomain(domain)
    axios.get(`api/private/analytics?tid=${tid}&domain=${domain}&period=${period}`)
    .then(res => {
      if (res.status == 200) {
        setUserOnline(res.data.unique_user_online)
        setTrafficConfig(buildTrafic(res.data.request_count_by_day, res.data.unique_user_by_week))
        setDeviceConfig(buildDevice(res.data.devices))
        setChanelConfig(buildChannels(res.data.referrers) || [])
        setPageViews(res.data.page_views_by_day || [])
      }
    })
  }
    
  function onChangeTime(dates, dateStrings) {
    setFrom(dateStrings[0])
    setTo(dateStrings[1])
  }

  function handleConfirmed() {
    let period = "date_range"
    let date = {
      "start_time" : from,
      "end_time": to
    }
    let params = {
      tid: appId,
      domain: domain,
      period: period,
      date_range: date
    }
    axios.get('api/private/analytics', {params})
    .then(res => {
      if (res.status == 200) {
        setUserOnline(res.data.unique_user_online)
        setTrafficConfig(buildTrafic(res.data.request_count_by_day, res.data.unique_user_by_week))
        setDeviceConfig(buildDevice(res.data.devices))
        setChanelConfig(buildChannels(res.data.referrers) || [])
        setPageViews(res.data.page_views_by_day || [])
      }
    })
  }

  const listPageViews = pageViews.map((el, idx) => 
    <li key={idx} className="pageviews-path">
      <div>{el[0]}</div>
      <div>{el[1]}</div>
    </li>
  )

  return (
    <div>
      <Row>
        <Col span={12}>
          <div className="d-flex pd-10">
            <div className="d-flex-center pdr-10 fz-16">{t('analytics.selected_apps')}: </div>
            <Select defaultValue={props.apps.length > 0 ? props.apps[0].id : ""} style={{ width: 200 }} onChange={handleChangeApp}>
              { props.apps.map(el => {
                return <Option key={el.id} value={el.id}>{el.name}</Option> 
              })                   
              }
            </Select>
            <Popover placement="right" title="Select date range" content={datePicker} trigger="click">
              <FieldTimeOutlined style={{ fontSize: '20px', color: '#fff', background: '#1890ff', padding: '5px', borderRadius: '2px', marginLeft: '5px' }}/>
            </Popover>
            
            
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={16} className="pd-10">
          <div className="table-card">
            <div className="card-title">{t('analytics.traffic')}
            <span className="fz-14 fw-0 pdl-10">
              <Badge status="processing" /> {userOnline} {t('analytics.user_online')} 
            </span>
            </div>
            <Chart
              options={trafficConfig ?.options}
              series={trafficConfig ?.series}
              type="area"
              width="100%"
            />
          </div>
        </Col>
        <Col span={8} className="pd-10">
          <div className="table-card">
            <div className="card-title">{t('analytics.device')}</div>
            <Chart options={deviceConfig ?.options} series={deviceConfig ?.series} type="donut" width="100%" />
            <table className="wc-table">
              <thead className="wc-thead">
                <tr>
                  <th>{t('analytics.device')}</th>
                  <th>{t('analytics.access_count')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><Badge status="success" />Mobile</td>
                  <td>{mobile}</td>
                </tr>
                <tr>
                  <td><Badge status="processing" />Tablet</td>
                  <td>{tablet}</td>
                </tr>
                <tr>
                  <td><Badge status="warning" />Desktop</td>
                  <td>{desktop}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={12} className="pd-10">
          <div className="table-card">
            <div className="card-title">{t('analytics.trafic_by_channel')}</div>
            <Chart
              options={chanelConfig ?.options}
              series={chanelConfig ?.series}
              type="line"
              width="100%"
            />
          </div>
        </Col>
        <Col span={12} className="pd-10">
          <div className="table-card">
            <div className="card-title">{t('analytics.number_of_visited')}</div>
            <div className="card-pageviews">
              <ul className="pageviews">
                <li className="thead">
                  <div>{t('analytics.page')}</div>
                  <div>{t('analytics.number_of_view_page')}</div>
                </li>
                {listPageViews}                
              </ul>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    apps: state.appsReducer.apps
  }
}

export default connect(mapStateToProps, {})(Analytics)