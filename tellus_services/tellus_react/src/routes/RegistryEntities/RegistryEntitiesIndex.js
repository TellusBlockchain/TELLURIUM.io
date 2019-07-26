import React from 'react';

import contract from "truffle-contract";
import RegistryEntitiesJSON from "../../contracts/RegistryEntities.json";

import { Row, Col, Button, Card, Container, Spinner } from 'react-bootstrap';

import RegistryEntitiesIndexMap from "../../components/RegistryEntitiesIndexMap";
import AboveTheMapWindow from "../../components/AboveTheMapWindow";

const use_postgre_cache_as_db = false;

class RegistryEntitiesIndex extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      registry_entities: [],
      showRegistryEntity: false,
      registryEntity: null,
      registry_entities_loaded: false
    };

    this.closeRegistryEntity = this.closeRegistryEntity.bind(this);
    this.showRegistryEntity = this.showRegistryEntity.bind(this);
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

      if (!use_postgre_cache_as_db) {
        let registry_entities = [];
        for (let i = 1, l = registry_entities_current_id.toNumber(); i <= l; l--) {
          let registry_entity = await deployed.find(l);

          let documents_url = process.env.REACT_APP_SAMPLE_DOCUMENT || '';
          if (registry_entity[3] && registry_entity[3].length > 0) {
            documents_url = registry_entity[3];
          }

          registry_entities.push({
            id: registry_entity[0].toNumber(),
            title: registry_entity[1],
            description: registry_entity[2],
            documents_url: documents_url,
            image_url: registry_entity[4],
            points: registry_entity[5].map( point => point.toNumber() ),
            created_at: (new Date(registry_entity[6].toNumber() * 1000)),
            updated_at: (new Date(registry_entity[7].toNumber() * 1000))
          });

          this.setState({
            registry_entities: registry_entities
          });
        }

        // console.log(this.state.registry_entities);
      } else if (use_postgre_cache_as_db) {
        let response = await fetch(`${process.env.REACT_APP_EXPLORER_SERVICE_BASE_URL}/registry_entities`);
        response = await response.json();
        console.log(response);
      }

      this.setState({
        registry_entities_loaded: true
      });
    } else {
  
    }
  }

  closeRegistryEntity() {
    this.setState({ showRegistryEntity: false });
  }

  showRegistryEntity(registry_entity) {
    this.setState({
      showRegistryEntity: true,
      registryEntity: registry_entity
    });
  }

  render() {
    return (
      <>
        <div className='map-container'>
          <RegistryEntitiesIndexMap registry_entities={this.state.registry_entities} showRegistryEntity={this.showRegistryEntity} />
        </div>
        <AboveTheMapWindow>
          {
            this.state.registry_entities.map((registry_entity) => {
              return (
                <Row key={registry_entity.id}
                     className="registry-entity-row"
                     onClick={() => { this.showRegistryEntity(registry_entity) } }
                >
                  <Col>
                    <h5>{registry_entity.title}</h5>
                    <p>
                      {
                        registry_entity.description.length > 280 ? (
                          `${registry_entity.description.substring(0, 280)}...`
                        ) : registry_entity.description
                      }
                    </p>
                  </Col>
                  <Col md='auto'>
                    <div className='registry-entities-image-container'>
                      <img src={registry_entity.image_url} />
                    </div>
                  </Col>
                </Row>
              )
            })
          }
          {!this.state.registry_entities_loaded && <Row>
            <Col className='spinnerCol'>
              <Spinner animation="grow" variant="primary" />
            </Col>
          </Row>}
        </AboveTheMapWindow>
        {
          this.state.registryEntity ? (
            <div className={ "registry-entity-show-container" + (this.state.showRegistryEntity ? '' : ' hidden') }>
              <div className="close-button-container" onClick={this.closeRegistryEntity}>
                <img src="/x.png"
                     srcSet="/x@2x.png 2x,
                             /x@3x.png 3x" />
              </div>
              {
                <Card style={{ position: 'relative', 'zIndex': 250 }}>
                  <Card.Img variant="top" src={this.state.registryEntity.image_url} />
                  <Card.Body style={{ position: 'relative' }}>
                    <Button variant="info"
                            href={this.state.registryEntity.documents_url}
                            target="_blank"
                            style={{ position: "absolute", top: '-27px', right: '16px', width: '54px', height: '54px', 'borderRadius': '50%' }}
                    >
                      <span style={{ display: 'inline-block', height: '100%', verticalAlign: 'middle' }}></span>
                      <img src="/download-doc.png"
                           style={{ verticalAlign: 'middle' }}
                           srcSet="/download-doc@2x.png 2x,
                                   /download-doc@3x.png 3x" />
                    </Button>
                    <Card.Title>{this.state.registryEntity.title}</Card.Title>
                    <Card.Text>{this.state.registryEntity.description}</Card.Text>
                  </Card.Body>
                </Card>
              }
            </div>
          ) : null
        }
      </>
    );
  }
}

export default RegistryEntitiesIndex;
