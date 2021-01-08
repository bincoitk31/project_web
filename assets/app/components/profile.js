import React, { useState, useEffect } from 'react';
import { translate} from 'react-i18next';
import { Input, Button, Row, Col } from 'antd'
import axios from 'axios';

const Profile = props => {
  const {t, account} = props
  const [first, setFirst] = useState(account.first_name || "")
  const [lastname, setLastname] = useState(account.last_name || "")
  const [phoneNumber,setPhoneNumber] = useState(account.phone_number || 0)
  const [email, setEmail] = useState(account.email || "")
  const [newPass, setNewPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")

  const onHandleChange = (event) => {
    let name = event.target.name
    let value = event.target.value
    switch(name) {
      case 'firstname':
        return setFirst(value);
      case 'lastname':
        return setLastname(value);
      case 'phone_number':
        return setPhoneNumber(value);
      case 'email':
        return setEmail(value);
      default:
        return console.log("default");
    }
  }

  const editProfile = () => {
    let params = {
      firstname: first,
      lastname: lastname,
      phone_number: phoneNumber,
      email: email
    }

    axios.post('api/private/edit_profile', params)
    .then(res => {
    })
  }

  const onHandleChangePassword = (event) => {
    let value = event.target.value
    let name = event.target.name
    switch(name) {
      case 'new_pass':
        return setNewPass(value)
      case 'confirm_pass':
        return setConfirmPass(value)
      default:
        console.log("changepass")
    }
  }

  const editPassword = () => {
    if (confirmPass == newPass) {
      let params = {
        password: confirmPass,
        email: email
      }

      axios.post('api/private/edit_password', params)
      .then(res => {
        
      })

    } else {
      
    }
  }

  return(
    <div>
       <Row >
          <Col span={12} className="pdlr-20">
            <div className="title-profile pdb-10">{t("profile.edit_profile")}</div>
            <label>{t("profile.last_name")}</label>
            <Input
              className="mrb-10"
              defaultValue={lastname}
              placeholder="Last name"
              name="lastname"
              onChange={ onHandleChange }
            />
 
            <label>{t("profile.first_name")}</label>
            <Input
              className="mrb-10"
              defaultValue={first}
              type="text"
              placeholder="First name"
              name="firstname"
              onChange={ onHandleChange }
            />
    
            <label>{t("profile.email")}</label>
              <Input 
                className="mrb-10"
                placeholder="Email"
                defaultValue={email}
                type="text"
                name="email"
                disabled
                onChange={ onHandleChange }
              />
 
              <label>{t("profile.phone_number")}</label>
                <Input 
                  className="mrb-10"
                  placeholder="Phone number"
                  defaultValue={phoneNumber}
                  name="phone_number"
                  onChange={ onHandleChange }
                />

              <div className="btn-save">
                <Button 
                  className="" 
                  type="primary"
                  name="txtsave"
                  onClick = { editProfile } 
                >
                    {t("profile.save")}
                </Button>
              </div>
          </Col>
          <Col span={12} className="pdlr-20">
            <div className="title-profile pdb-10">{t("profile.reset_pass")}</div>
            <label>{t("profile.new_pass")}</label>
              <Input 
                className="mrb-10"
                placeholder="******"
                type="password"
                name="new_pass"
                
                onChange={ onHandleChangePassword }
              />
 
              <label>{t("profile.confirm_pass")}</label>
                <Input 
                  className="mrb-10"
                  placeholder="******"
                  name="confirm_pass"
                  type="password"
                  onChange={ onHandleChangePassword }
                />
            <div className="btn-save">
                <Button 
                  className="" 
                  type="primary"
                  name="txtsave"
                  onClick = { editPassword } 
                >
                    {t("profile.save")}
                </Button>
              </div>
          </Col>
       </Row>
    </div>
  )
}


export default translate('common')(Profile)