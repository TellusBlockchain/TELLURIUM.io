import React from 'react';
import { Table, Row, Col } from 'react-bootstrap';

class PagesExplorer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      transactions: []
    };
  }

  async componentDidMount () {
    let response = await fetch("http://18.195.159.148:5002/transactions");
    response = await response.json();
    let transactions = response;
    this.setState({
      transactions
    });
  }

  render () {
    return (
      <React.Fragment>
        <h2>Explorer</h2>
        <Row>
          <Col md={{span: 10, offset: 1}}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>transactionHash</th>
                  <th>eventName</th>
                </tr>
              </thead>
              <tbody>
              {
                this.state.transactions.map((transaction) => {
                  return (
                    <tr>
                      <td><a href={'https://ropsten.etherscan.io/tx/' + transaction.transactionHash}>{transaction.transactionHash}</a></td>
                      <td>{transaction.eventName}</td>
                    </tr>
                  )
                })
              }
              </tbody>
            </Table>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default PagesExplorer;
