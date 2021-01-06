import React, { Component, useState } from 'react';
import { useHistory, Redirect } from "react-router-dom";
import { Form, Input, Button,  Row, Col, Modal, Space } from 'antd';
import axios from 'axios';

function Signup() {
  const [firstName, setFirstName] = useState()
  const [lastName, setLastName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [phoneNumber, setPhoneNumber] = useState()
  const [confirm, setConFirm] = useState()
  let history = useHistory();
  const handleChange = (e) => {
    let name = e.target.name
    let value = e.target.value
    switch(name) {
      case 'firstname':
        return setFirstName(value);
      case 'lastname':
        return setLastName(value);
      case 'email':
        return setEmail(value);
      case 'phonenumber':
        return setPhoneNumber(value);
      case 'password':
        return setPassword(value);
      case 'confirm':
        return setConFirm(value);
      default: 
        return console.log("errChangeInput")
    }
  }

  const handleSubmit = () => {
    let params = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phoneNumber,
      password: password,
      confirm: confirm
    }
    console.log(params, "params")

    axios.post(`/api/public/signup`, params )
    .then(res => {
      console.log(res, "resssssss")
      if (res.status == 200 && res.data.success == true) {
        modalSuccess()
      }
    })
    .catch(err => {
      console.log(err, "err")
    })

  }

  const modalSuccess = () => {
    
    Modal.success({
      content: 'You have signed up successfully',
      okText: 'Continue',
      afterClose: redirectTO("/login")
    });
  }

  const redirectTO = (val) => {
    console.log("vl")
    history.push(val)
  }

  return <div className="container">
    <Row className="wrap-signup" justify={"center"}>
      <Col className="signup" span={6}>
        <div className="signup-logo">
          <img src="https://statics.pancake.vn/web-media/58/ae/76/bc/f2f2716dc155a6c0a0602e3eb98c012692b0c374de1450f11d070d16.png" />
        </div>
        <div className="signup-title">
          <span>Sign Up</span>
        </div>
        <Form
          labelCol={{span: 8}}
          name="sign-up"
          className="signup-form"
        >
          <Row>
            <Col span={11}>
              <Form.Item 
                rules={[{ required: true, message: 'Please input your first name!' }]}
              >
                <label>First name</label>
                <Input
                  type="text"
                  name="firstname"
                  onChange={handleChange}
                />
            </Form.Item>
            </Col>
            <Col span={11} offset={2}>
              <Form.Item 
                rules={[{ required: true, message: 'Please input your last name!' }]}
              >
                <label>Last name</label>
                <Input
                  type="text"
                  name="lastname"
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <label>Email</label>
                <Input 
                  type="email"
                  name="email"
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                rules={[{ required: true, message: 'Please input your phone number!' }]}
              >
                <label>Phone number</label>
                <Input 
                  type="number"
                  name="phonenumber"
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item 
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <label>Password</label>
                <Input 
                  type="password"
                  name="password"
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item>
                <label>Confirm password</label>
                <Input 
                  type="password"
                  name="confirm"
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item>
                <Button  htmlType="submit" block className="btn-signup" onClick={handleSubmit}>
                  Sign Up
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {/* <div className="signup-more">
          <span>Already have an account? <a>Login here.</a></span>
        </div> */}
        <div className="signup-more">
          <ul>
            <li>Already have an account? <a href="/login">Login here.</a></li>
          </ul>
        </div>
      </Col>
    </Row>
  </div>
  
}
export default Signup;