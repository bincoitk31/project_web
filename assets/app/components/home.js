import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from 'antd';
class Home extends Component {
  render() {
    return <div className="container">
      <div className="home">
        <img src="https://statics.pancake.vn/web-media/3c/a9/af/85/381b30eb2a756bf740f0b5470e52a285c94ba294008f3ef6968ca6eb.jpg" width="100%" height="100%" />  
        <div className="home-button">
        <Button href="/login" type="primary">Login</Button>
        <Button href="/signup" type="primary">Sign Up</Button>
        </div>
      </div>   
    </div>
  }
}
export default Home;