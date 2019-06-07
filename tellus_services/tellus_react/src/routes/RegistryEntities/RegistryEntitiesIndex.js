import React from 'react';

import contract from "truffle-contract";
import RegistryEntitiesJSON from "../../contracts/RegistryEntities.json";

import { Row, Col, Form, Button, Card, Container } from 'react-bootstrap';

class RegistryEntitiesIndex extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      registry_entities: []
    };
  }

  async componentDidMount () {
    if (window.ethereum.selectedAddress) {
      await this.handleClick();
    }
  }

  async handleClick() {
    if (window.ethereum.isMetaMask) {
      const accounts = await window.ethereum.enable();
      const RegistryEntities = contract(RegistryEntitiesJSON);
  
      RegistryEntities.setProvider(window.web3.currentProvider);
      RegistryEntities.defaults({
        from: accounts[0]
      });
  
      const deployed = await RegistryEntities.deployed();
      let registry_entities_current_id = await deployed.get_current_id();

      let registry_entities = [];
      for (let i = 1; i <= registry_entities_current_id.words[0]; i++) {
        let registry_entity = await deployed.find(i);
        registry_entities.push({
          id: registry_entity[0].words[0],
          title: registry_entity[1],
          description: registry_entity[2],
          documents_url: registry_entity[3],
          image_url: registry_entity[4],
          points: registry_entity[5].map(point => point.words[0]),
          created_at: registry_entity[6].words[0],
          updated_at: registry_entity[7].words[0]
        });
      }
      console.log(registry_entities)

      this.setState({
        registry_entities: registry_entities
      });
    } else {
  
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1>Index of Registry Entities</h1>
        <Container>
          {
            this.state.registry_entities.map((registry_entity) => {
              return (
                <Row>
                  <Col>
                    <Card>
                      <Card.Img variant="top" src={registry_entity.image_url} />
                      <Card.Body>
                        <Card.Title>{registry_entity.title}</Card.Title>
                        <Card.Text>{registry_entity.description}</Card.Text>
                        <Button variant="primary">Download documents</Button>
                      </Card.Body>
                      <Card.Footer>
                        <small className="text-muted">Last updated 3 mins ago</small>
                      </Card.Footer>
                    </Card>
                  </Col>
                </Row>
              )
            })
          }
        </Container>
      </React.Fragment>
    );
  }
}

export default RegistryEntitiesIndex;