import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

class MainWindow extends React.Component {
  render () {
    return (
      <Container>
        <Row>
          <Col md={{ span: 8, offset: 2 }} className="bg_card">
            { this.props.children }
          </Col>
        </Row>
      </Container>
    );
  }
}

export default MainWindow;


{/* <React.Fragment>
<h2>Welcome</h2>
{
  this.state.isLoginnedViaMetamask ? (
    this.state.role === 1 ? (
      <React.Fragment>
        <p>You logined via MetaMask as Deployer</p>
      </React.Fragment>
    ) : (
      this.state.role === 2 ? (
        <React.Fragment>
          <p>You logined via MetaMask as Notary</p>
        </React.Fragment>
      ) : (
        this.state.role === 3 ? (
          <React.Fragment>
            <p>You logined via MetaMask as a common User</p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <p>You are not in validated users list</p>
          </React.Fragment>
        )
      )
    )
  ) : (
    <React.Fragment>
      <p>You'll need to auth via MetaMask</p>
      <button type="button"
              onClick={this.tryToLoginViaMetamask}
      >Login via MetaMask</button>
    </React.Fragment>
  )
}
</React.Fragment> */}