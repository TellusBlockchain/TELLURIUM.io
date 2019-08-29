import React from 'react';
import { Table, Row, Col, Container,
         InputGroup, FormControl, Button, Form } from 'react-bootstrap';

class UsersIndex extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      users: []
    };
  }

  async componentDidMount () {
    let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users`);
    response = await response.json();
    let users = response;
    this.setState({
      users
    });
  }

  render () {
    return (
      <div style={{ backgroundColor: '#e9e9e9', minHeight: '100%' }}>
        <Container md={{ span: 10, offset: 1 }}>
          <Row>
            <Col>
              <Table hover className='explorer-table'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>ETH Address</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                {
                  this.state.users.map((user) => {
                    return (
                      <tr>
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                        <td>{user.eth_address}</td>
                        <td>{user.role}</td>
                      </tr>
                    )
                  })
                }
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default UsersIndex;
