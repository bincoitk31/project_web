import React, { useContext, useState, useEffect, useRef, Component } from 'react';
import { Table, Input, Button, Popconfirm, Modal } from 'antd';
import { connect } from 'react-redux'
import { createNewApp, getApps, removeApp } from '../actions/appsAction'

function Apps(props) {
  const {apps, getApps, createNewApp, removeApp} = props
  console.log(props, "props")
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: '30px',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true,
      },
      {
        title: 'Domain',
        dataIndex: 'domain',
        editable: true,
      },
      {
        title: 'Script',
        dataIndex: 'script',
        render: (text, record) => 
          apps.length >= 1 ? (
            <a>Copy</a>
          ) : null
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        render: (text, record) =>
          apps.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => removeApp(record.id)}>
              <a>Delete</a>
            </Popconfirm>
          ) : null,
      },
    ];
    
    
        
    
    const [visible, setVisible] = useState(false)
    const [name, setName] = useState()
    const [domain, setDomain] = useState()

    const showModal = () => {
      setVisible(true)
    };
  
    const handleOk = () => {
      let params = {
        name: name,
        domain: domain
      }
      createNewApp(params)
      console.log(params, "paramss")
      setVisible(false)
    };
  
    const handleCancel = () => {
      setVisible(false)
    };
 
  const handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };

  useEffect(() => {
    console.log(apps, "data")
    getApps()
  }, [])


  return (
    <div>
      <Button
        onClick={showModal}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a app
      </Button>
      <Table
        bordered
        dataSource={apps}
        columns={columns}
      />
      <Modal
          title="New app"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
      >
        <label>Name app</label>
        <Input placeholder="webcake" onChange={ e => setName(e.target.value)}/>
        <div style={{padding: '5px 0'}}></div>
        <label>Domain</label>
        <Input placeholder="webcake.com" onChange={ e=> setDomain(e.target.value)}/>
      </Modal>
    </div>
    
  );
}

const mapStateToProps = state => {
  return {
   apps: state.appsReducer.apps
  }
}

export default connect(mapStateToProps, {
  createNewApp,
  getApps, 
  removeApp
})(Apps)
