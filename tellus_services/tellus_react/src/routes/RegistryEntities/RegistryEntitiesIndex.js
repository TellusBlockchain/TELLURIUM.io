import React from 'react';

import contract from "truffle-contract";
import RegistryEntitiesJSON from "../../contracts/RegistryEntities.json";

import { Row, Col, Button, Card, Container } from 'react-bootstrap';

import RegistryEntitiesIndexMap from "../../components/RegistryEntitiesIndexMap";

class RegistryEntitiesIndex extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      registry_entities: []
    };
  }

  async componentDidMount () {
    if (window.ethereum.selectedAddress) {
      await this.loadRegistryEntities();
    }
  }

  async loadRegistryEntities () {
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
      for (let i = 1, l = registry_entities_current_id.toNumber(); i <= l; l--) {
        let registry_entity = await deployed.find(l);
        registry_entities.push({
          id: registry_entity[0].toNumber(),
          title: registry_entity[1],
          description: registry_entity[2],
          documents_url: registry_entity[3],
          image_url: registry_entity[4],
          points: registry_entity[5].map( point => point.toNumber() ),
          created_at: (new Date(registry_entity[6].toNumber() * 1000)),
          updated_at: (new Date(registry_entity[7].toNumber() * 1000))
        });
      }

      // console.log(registry_entities)

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
        <Row>
          <Col md={{span: 10, offset: 1}}>
            <RegistryEntitiesIndexMap registry_entities={this.state.registry_entities} />
          </Col>
        </Row>
        <Container>
          {
            this.state.registry_entities.map((registry_entity) => {
              return (
                <Row key={registry_entity.id}>
                  <Col>
                    <Card>
                      <Card.Img variant="top" src={registry_entity.image_url} />
                      <Card.Body>
                        <Card.Title>{registry_entity.title}</Card.Title>
                        <Card.Text>{registry_entity.description}</Card.Text>
                        <Button variant="primary"
                                href={registry_entity.documents_url}
                                target="_blank"
                        >Download documents</Button>
                      </Card.Body>
                      <Card.Footer>
                        <small className="text-muted">Updated at {
                          registry_entity.updated_at.toLocaleString("en-US")
                        }</small>
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
