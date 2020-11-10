import React, { Component } from 'react';
import Apps from './apps'
import Analytis from "./analytics"

import { Layout, Menu, Breadcrumb } from 'antd';
import {
  AppstoreOutlined,
  AreaChartOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

class Dashboard extends Component {

  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    return <Layout style={{ minHeight: '100vh' }} className="dashboard-wrapper">
    <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
      <div className="logo">
        <img src="https://statics.pancake.vn/web-media/43/a8/25/3c/6698d516a44f85b6fbd72c8670499dd37d43fb44d5556d3304ffb868.png" />
      </div>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="1" icon={<AreaChartOutlined />}>
          Analytis
        </Menu.Item>
        <Menu.Item key="2" icon={<AppstoreOutlined />}>
          Apps
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout className="site-layout">
      <Header className="site-layout-background" style={{ padding: 0 }}>
        <div className="account">
          <span className="name-user">Hello , Hung Bin</span>
          <span className="logo-user"><UserOutlined /></span>
        </div>
      </Header>
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Apps</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
          <Apps></Apps>
        </div>
      </Content>
     <Footer style={{ textAlign: 'center' }}>By BinNeo</Footer>
   </Layout>
 </Layout>
  }
}
export default Dashboard;