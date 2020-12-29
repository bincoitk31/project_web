import React, { Component, useState, useEffect } from 'react';
import Apps from './apps'
import Analytis from "./analytics"
import Profile from "./profile"
import axios from 'axios';
import { Layout, Menu, Breadcrumb, Select } from 'antd';
import {
  AppstoreOutlined,
  AreaChartOutlined,
  UserOutlined
} from '@ant-design/icons';

import { translate, Trans } from 'react-i18next';

const { Header, Content, Footer, Sider } = Layout;
const { Option } = Select;

function Dashboard(props) {
  
  const { t, i18n } = props
  const [collapsed, setCollapsed] = useState(false)
  const [tab, setTab] = useState("2")
  const [name, setName] = useState("")
  const [account, setAccount] = useState()
  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };

  const handleChangeTab = (item) => {
    setTab(item.key) 
  }

  const handleChangeLanguage = (value) => {
    if (value == 'vn') {
      i18n.changeLanguage('vn')
    } else {
      i18n.changeLanguage('en')
    }
  }

  
  useEffect(() => {
    axios.get('api/private/account')
    .then(res => {
      
      if (res.status == 200) {
        setName(res.data.account[0].first_name)
        setAccount(res.data.account[0])
      }
    })
  }, [])

  return <Layout style={{ minHeight: '100vh' }} className="dashboard-wrapper">
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div className="logo">
        <img src="https://statics.pancake.vn/web-media/43/a8/25/3c/6698d516a44f85b6fbd72c8670499dd37d43fb44d5556d3304ffb868.png" />
      </div>
      <Menu theme="dark" defaultSelectedKeys={['2']} mode="inline" onClick={handleChangeTab}>
        <Menu.Item key="1" icon={<AreaChartOutlined />}>
          {t('dashboard.analytics')}
        </Menu.Item>
        <Menu.Item key="2" icon={<AppstoreOutlined />}>
          {t('dashboard.apps')}
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
          {t('dashboard.profile')}
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout className="site-layout">
      <Header className="site-layout-background" style={{ padding: 0 }}>
        <div className="account">
          <div style={{paddingRight: "10px"}}>            
            <Select defaultValue="vn" style={{ width: 80 }} bordered={false} onSelect={handleChangeLanguage}>
              <Option value="vn">
                {/* <span>Tiếng việt</span> */}
                <img width="30" height="30" src="https://webcake.io/static/icon/lang_vn.svg" alt="Việt Nam"/>
              </Option>
              <Option value="en">
                {/* <span>English</span> */}
                <img width="30" height="30" src="https://webcake.io/static/icon/lang_us.svg" alt="English"/>
              </Option>
            </Select>
          </div>
          <span className="name-user">{t('dashboard.hello')} , {name}</span>
          <span className="logo-user"><UserOutlined /></span>
        </div>
      </Header>
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          {tab == 1 ? 
            <Breadcrumb.Item>{t('dashboard.analytics')}</Breadcrumb.Item>
            : ""
          }
          {
            tab == 2 ?
            <Breadcrumb.Item>{t('dashboard.apps')}</Breadcrumb.Item>
            : ""
          }
          {
            tab == 3 ?
            <Breadcrumb.Item>{t('dashboard.profile')}</Breadcrumb.Item>
            : ""
          }
        </Breadcrumb>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
          {tab == 1 ? 
            <Analytis t={t}></Analytis>
            : ""
          }
          {
            tab == 2 ?
            <Apps t={t}></Apps>
            : ""
          }
          {
            tab == 3 ?
            <Profile t={t} account={account}></Profile>
            : ""
          }
        </div>
      </Content>
     
   </Layout>
 </Layout>
  
}
export default translate('common')(Dashboard);