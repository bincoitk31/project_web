import React, { Component, useState } from 'react';
import { Form, Input, Button, Checkbox, Row, Col } from 'antd';
import axios from 'axios';

function Login() {
  const [user, setUser] = useState()
  const [password, setPassword] = useState()

  const handleChange = (e) => {
    let name = e.target.name
    let value = e.target.value
    switch(name) {
      case 'user':
        return setUser(value)
      case 'password':
        return setPassword(value)
      default:
        return console.log("errLogin")  
    }
  }

  const handleSubmit = () => {
    let params = {
      user: user,
      password: password
    }

    axios.post(`/api/public/login`, params )
    .then(res => {
      console.log(res, "resssssss")
      if (res.status == 200 && res.data.success == true) {
        window.location.href = window.origin + "/dashboard"
      }
    })
    .catch(err => {
      console.log(err, "err")
    })

  }

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };
  
  
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  
  return <div className="container">
    <Row className="wrap-login" justify={"center"}>
      <Col className="login" span={6}>
        <div className="login-logo">
          <img src="https://statics.pancake.vn/web-media/43/a8/25/3c/6698d516a44f85b6fbd72c8670499dd37d43fb44d5556d3304ffb868.png" />
          </div>
        <div className="login-title">
          Welcome
        </div>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="login-form"
        >
          <Form.Item
            // label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
            noStyle
            
          >
            <label>Username</label>
            <Input
              style={{margin: '10px 0 10px 0'}}
              type="text"
              name="user"
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item
            // label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            noStyle
            style={{marginTop: '20px'}}
          >
            <label>Password</label>
            <Input.Password
              style={{margin: '10px 0 10px 0'}} 
              type="text"
              name="password"
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item {...tailLayout} wrapperCol={{span: 24}} style={{marginTop: "20px"}}>
            <Button  htmlType="submit" block className="btn-login" onClick={handleSubmit}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="login-more">
          <ul>
            <li>Forgot <a>Username/Password</a></li>
            <li>Don’t have an account? <a href="/signup">Sign Up</a></li>
          </ul>
        </div>
      </Col>
    </Row>
  </div>;
  
}
export default Login;