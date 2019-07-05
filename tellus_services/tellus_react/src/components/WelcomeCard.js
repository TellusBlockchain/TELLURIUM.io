import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

class WelcomeCard extends React.Component {
  render () {
    return (
      <Container>
        <Row>
          <Col md={{ span: 8, offset: 2 }} className="bg_card">
            <Row>
              <Col className="separator_hor">
                <div>
                  <img src="/tellurium-logo.png"
                       srcSet="/tellurium-logo@2x.png 2x,
                              /tellurium-logo@3x.png 3x"
                       className="Tellurium_logo" />
                </div>
                <div>
                  <img src="/art.jpg"
                       srcSet="/art@2x.jpg 2x,
                               /art@3x.jpg 3x"
                       className="art" />
                </div>
                <div className="With-Proof-of-Ownership">
                  With Proof of Ownership on the Blockchain property owners can
                  express their real estate rights in the crypto economy with
                  our Patent Pending Blockchain Protocol.
                </div>
              </Col>
              <Col>
                <div className="Welcome">
                  Welcome!
                </div>
                <div className="signin_via_metamask_button_container">
                  <button type="button"
                          className="signin_via_metamask_button"
                          onClick={this.props.tryToLoginViaMetamask}
                  >Login via MetaMask</button>
                </div>
                <div className="signin_as_notary_button_container">
                  <button type="button"
                          className="signin_as_notary_button"
                          onClick={this.props.tryToLoginViaMetamask}
                  >Sign in as Notary</button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default WelcomeCard;


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