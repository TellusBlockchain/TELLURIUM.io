import React from 'react';
import { Table, Row, Col, Container,
         InputGroup, FormControl, Button, Form } from 'react-bootstrap';

class PagesExplorer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      transactions: []
    };
  }

  async componentDidMount () {
    let response = await fetch(`${process.env.REACT_APP_EXPLORER_SERVICE_BASE_URL}/transactions`);
    response = await response.json();
    let transactions = response;
    this.setState({
      transactions
    });
  }

  render () {
    return (
      <div style={{ backgroundColor: '#e9e9e9' }}>
        <Container md={{ span: 10, offset: 1 }}>
          <Row style={{ paddingTop: '21px' }}>
            <Col>
              <InputGroup>
                <FormControl
                  placeholder="Search"
                  aria-label="Search"
                />
                <InputGroup.Append>
                  <Button variant="outline-secondary">Search</Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
            <Col>
              <Form.Control as="select">
                <option>AfterRegistryEntityCreate</option>
                <option>AfterUserCreate</option>
              </Form.Control>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table hover className='explorer-table'>
                <thead>
                  <tr>
                    <th>Transaction Hash</th>
                    <th>Event</th>
                  </tr>
                </thead>
                <tbody>
                {
                  this.state.transactions.map((transaction) => {
                    return (
                      <tr>
                        <td>
                          <a href={'https://ropsten.etherscan.io/tx/' + transaction.transactionHash}
                              target="_blank"
                          >
                            {transaction.transactionHash}
                          </a>
                        </td>
                        <td>{transaction.eventName}</td>
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

export default PagesExplorer;
