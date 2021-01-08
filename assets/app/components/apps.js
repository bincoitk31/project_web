import React, { useContext, useState, useEffect, useRef, Component } from 'react';
import { Table, Input, Button, Popconfirm, Modal } from 'antd';
import { connect } from 'react-redux'
import { createNewApp, getApps, removeApp } from '../actions/appsAction'

function Apps(props) {
  const {apps, getApps, createNewApp, removeApp, t} = props
  
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: '30px',
        key: 'id'
      },
      {
        title: t('apps.name'),
        dataIndex: 'name',
        editable: true,
        key: 'name'
      },
      {
        title: t('apps.domain'),
        dataIndex: 'domain',
        editable: true,
        key: 'domain'
      },
      {
        title: t('apps.script'),
        dataIndex: 'script',
        key: 'script',
        render: (text, record) => 
          apps.length >= 1 ? (
            <a onClick={copyScript(record.id)} >Copy</a>
          ) : null
      },
      {
        title: t('apps.action'),
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) =>
          apps.length >= 1 ? (
            <Popconfirm title={t('apps.sure_to_delete?')} onConfirm={() => removeApp(record.id)}>
              <a>{t('apps.delete')}</a>
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
    
    const copyScript = (id) => {
      let script = `
      <script>
      !function(e,t){let a=t.createElement("script");a.async=!0,a.src="https://statistics.freelp.xyz/js/main.js";
          let n=t.getElementsByTagName("script")[0];n.parentNode.insertBefore(a,n),e.wa=function(){(wa.q=wa.q||[]).push(arguments)}}(window,document);
          wa('init', "${id}");
     </script>
      `
      navigator.clipboard.writeText(script)
      
    }

    const handleOk = () => {
      let params = {
        name: name,
        domain: domain
      }
      createNewApp(params)
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
        {t('apps.add_a_script')}
      </Button>
      <Table
        bordered
        dataSource={apps.map(el => ({key: el.id, id: el.id, name: el.name, domain: el.domain, operation: el.remove}))}
        columns={columns}
        
      />
      <Modal
          title={t('apps.new_script')}
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
      >
        <label>{t('apps.name_script')}</label>
        <Input placeholder="webcake" onChange={ e => setName(e.target.value)}/>
        <div style={{padding: '5px 0'}}></div>
        <label>{t('apps.domain')}</label>
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
