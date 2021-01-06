import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from 'antd';
class Home extends Component {
  render() {
    return <div className="container">
      <div className="home">
        <div className='logo-home'>
          <img src="https://statics.pancake.vn/web-media/58/ae/76/bc/f2f2716dc155a6c0a0602e3eb98c012692b0c374de1450f11d070d16.png" alt="logo"/>
        </div>
        <div className="home-button">
        <Button href="/login" type="primary">Login</Button>
        <Button href="/signup" type="primary">Sign Up</Button>
        </div>
      </div>   
    </div>
  }
}
export default Home;