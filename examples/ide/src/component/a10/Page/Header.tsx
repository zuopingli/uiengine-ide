import React from 'react'
import { Layout, Icon, Row, Col } from 'antd'

const { Header } = Layout
class HeaderComponent extends React.Component<any, any> {
  render() {
    return (
      <Header className="GUI-header">
        <Row className="flex-bar">
          <Col span={3} className="logo">
            <img src="logo-a10.png" />
          </Col>
          <Col span={21} className="float-right">
            <Row>
              {/* TODO  */}
              <Col className="bar-action">
                <Icon type="home" />
                English
                <Icon type="down" className="menu-icon" />
              </Col>
              <Col className="bar-action ">
                <Icon type="sync" />
                Syncing
                <Icon type="down" className="menu-icon" />
              </Col>
              <Col className=" bar-action">
                <Icon type="share-alt" />
                Shared
                <Icon type="down" className="menu-icon" />
              </Col>
              <Col className="bar-action">
                <Icon type="logout" />
                Admin
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
    )
  }
}

export default HeaderComponent
