import React from 'react';

import contract from "truffle-contract";
import RegistryEntitiesJSON from "../../contracts/RegistryEntities.json";

import { Row, Col, Button, Card, Container, Spinner, Form } from 'react-bootstrap';

import RegistryEntitiesIndexMap from "../../components/RegistryEntitiesIndexMap";
import AboveTheMapWindow from "../../components/AboveTheMapWindow";
import { relative } from 'path';

const use_postgre_cache_as_db = true;

class RegistryEntitiesIndex extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      registry_entities:        [],
      showRegistryEntity:       false,
      registryEntity:           null,
      registry_entities_loaded: false,
      show_only_verified:       false
    };

    this.closeRegistryEntity = this.closeRegistryEntity.bind(this);
    this.showRegistryEntity = this.showRegistryEntity.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  async componentDidMount () {
    await this.loadRegistryEntities();
  }

  async loadRegistryEntities () {
    let registry_entities = [];
    if (!use_postgre_cache_as_db) {
      if (window.ethereum.isMetaMask) {
        const accounts = await window.ethereum.enable();
        const RegistryEntities = contract(RegistryEntitiesJSON);
    
        RegistryEntities.setProvider(window.web3.currentProvider);
        RegistryEntities.defaults({
          from: accounts[0]
        });
    
        const deployed = await RegistryEntities.deployed();
        let registry_entities_current_id = await deployed.get_current_id();

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
            priceUSD: registry_entity[6],
            points: registry_entity[6].map( point => point.toNumber() ),
            created_at: (new Date(registry_entity[7].toNumber() * 1000)),
            updated_at: (new Date(registry_entity[8].toNumber() * 1000))
          });

          this.setState({
            registry_entities: registry_entities
          });
        }
      }
    } else if (use_postgre_cache_as_db) {
      let verified = this.state.show_only_verified ? '/verified' : '';
      let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/registry_entities${verified}`);
      response = await response.json();
      response.map( (registry_entity) => {
        // console.log(registry_entity)
        
        registry_entity.points = JSON.parse(registry_entity.points)
        registry_entity.points = registry_entity.points.map( (coord) => (coord >> 0) );

        // Monkey patch for old test urls. TODO: remove after database reset
        registry_entity.image_url     = registry_entity.image_url.replace('18.195.159.148', 'tellurium.io');
        registry_entity.image_url     = registry_entity.image_url.replace('localhost', 'tellurium.io');
        registry_entity.image_url     = registry_entity.image_url.replace('http://', 'https://');
        registry_entity.image_url     = registry_entity.image_url.replace(':8080', ':8081');
        registry_entity.documents_url = registry_entity.documents_url.replace('18.195.159.148', 'tellurium.io');
        registry_entity.documents_url = registry_entity.documents_url.replace('localhost', 'tellurium.io');
        registry_entity.documents_url = registry_entity.documents_url.replace('http://', 'https://');
        registry_entity.documents_url = registry_entity.documents_url.replace(':8080', ':8081');
        if (registry_entity.image_url === "") {
          registry_entity.image_url = "https://tellurium.io:8081/ipfs/QmPDx9feQjLpnUpdYNZdpSA6Va73vtrRawkbvQWNHphNi5"
        }
        if (registry_entity.documents_url === "") {
          registry_entity.documents_url = "https://tellurium.io:8081/ipfs/QmUo5uXFymFB2rTaoQb1QcCMxQegE3S9gZx37Z5iTvZ4ZB"
        }
        //
      });
      registry_entities = response;
      this.setState({
        registry_entities: registry_entities
      });
    }

    this.setState({
      registry_entities_loaded: true
    });
  }

  closeRegistryEntity() {
    this.setState({ showRegistryEntity: false });
  }

  showRegistryEntity(registry_entity) {
    this.setState({
      showRegistryEntity: true,
      registryEntity:     registry_entity
    });
  }

  async handleCheckboxChange(event) {
    const value = event.target.checked;

    await this.setState({
      show_only_verified:       value,
      registry_entities:        [],
      showRegistryEntity:       false,
      registryEntity:           null,
      registry_entities_loaded: false,
    });

    await this.loadRegistryEntities();
  }

  render() {
    return !(this.props.token_is_valid || this.props.current_user_role != null) ? (
      <div style={{ 'color': 'white' }}>No permissions</div>
    ) : (
      <>
        <div className='map-container'>
          <RegistryEntitiesIndexMap registry_entities={this.state.registry_entities}
                                    showRegistryEntity={this.showRegistryEntity} />
        </div>
        <div className="above-the-map-left-window">
          <Row className="registry-entities-container-header">
            <Col>
              <>
                <Form.Check type={'checkbox'}
                            id={`show_only_verified_checkbox`}
                            label={`Show entities only of verified users`}
                            onChange={this.handleCheckboxChange}/>
              </>
            </Col>
          </Row>
          <div className="registry-entities-container">
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
          </div>
          {!this.state.registry_entities_loaded && <Row>
            <Col className='spinnerCol'>
              <Spinner animation="grow" variant="primary" />
            </Col>
          </Row>}
        </div>
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
                    <Card.Text>
                      <div><b>PriceUSD: {this.state.registryEntity.priceUSD}</b></div>
                      <div>{this.state.registryEntity.description}</div>
                    </Card.Text>
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
