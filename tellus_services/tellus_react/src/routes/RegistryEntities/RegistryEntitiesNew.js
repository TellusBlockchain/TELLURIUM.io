import React from 'react';

import contract from "truffle-contract";
import RegistryEntitiesJSON from "../../contracts/RegistryEntities.json";

import { Row, Col, Form, Button } from 'react-bootstrap';

import ipfsClient from 'ipfs-http-client';

import RegistryEntitiesNewMap from "../../components/RegistryEntitiesNewMap";

const LAT_LNG_DIVIDER = 1000000;

class RegistryEntitiesNew extends React.Component {
  constructor (props) {
    super(props);

    this.ipfs = ipfsClient(
      process.env.REACT_APP_IPFS_API_SERVER_URL,
      process.env.REACT_APP_IPFS_API_SERVER_PORT
    );

    this.state = {
      title: "",
      description: "",
      documents_url: "",
      image_url: "",
      points: [ 5, 5, 5 ]
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.upload_documents = this.upload_documents.bind(this);
    this.upload_image = this.upload_image.bind(this);

    this.saveLatLngToState = this.saveLatLngToState.bind(this);
  }

  upload_documents (event) {
    event.stopPropagation()
    event.preventDefault()
    this.saveToIpfsDocuments(event.target.files)
  }

  saveToIpfsDocuments (files) {
    let ipfsId
    this.ipfs.add([...files], { progress: (prog) => console.log(`received: ${prog}`) })
      .then((response) => {
        console.log(response)
        ipfsId = response[0].hash
        console.log(ipfsId)
        this.setState({
          documents_url: `${process.env.REACT_APP_IPFS_GATEWAY_URL}/ipfs/${ipfsId}`
        })
      }).catch((err) => {
        console.error(err)
      })
  }

  upload_image (event) {
    event.stopPropagation()
    event.preventDefault()
    this.saveToIpfsImage(event.target.files)
  }

  saveToIpfsImage (files) {
    let ipfsId
    this.ipfs.add([...files], { progress: (prog) => console.log(`received: ${prog}`) })
      .then((response) => {
        console.log(response)
        ipfsId = response[0].hash
        console.log(ipfsId)
        this.setState({
          image_url: `${process.env.REACT_APP_IPFS_GATEWAY_URL}/ipfs/${ipfsId}`
        })
      }).catch((err) => {
        console.error(err)
      })
  }

  saveLatLngToState(latLng) {
    this.setState({
      points: [
        Math.round(latLng.lat*LAT_LNG_DIVIDER),
        Math.round(latLng.lng*LAT_LNG_DIVIDER),
        1
      ]
    });
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
      await deployed.create(
        this.state.title,
        this.state.description,
        this.state.documents_url,
        this.state.image_url,
        this.state.points
      );
      
      this.props.history.push('/registry_entities/index')
    } else {
  
    }
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
        [name]: value
    });
  }

  render() {
    return (
      <Form>
        <Form.Group controlId="formTitle" as={Row}>
          <Form.Label column md={2}>Title:</Form.Label>
          <Col md={9}>
            <Form.Control type="text"
                          placeholder="Title"
                          name="title"
                          value={this.state.title}
                          onChange={this.handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group controlId="formDescription" as={Row}>
          <Form.Label column md={2}>Description:</Form.Label>
          <Col md={9}>
            <Form.Control as="textarea"
                          placeholder="Description"
                          name="description"
                          value={this.state.description}
                          onChange={this.handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group controlId="formDocumentsUrl" as={Row}>
          <Form.Label column md={2}>Upload Documents:</Form.Label>
          <Col md={9}>
            <Form.Control type="file"
                          name="documents_url"
                          onChange={this.upload_documents} />
          </Col>
        </Form.Group>
        <Form.Group controlId="formImageUrl" as={Row}>
          <Form.Label column md={2}>Upload Image:</Form.Label>
          <Col md={9}>
            <Form.Control type="file"
                          name="image_url"
                          onChange={this.upload_image} />
          </Col>
        </Form.Group>
        <Form.Group controlId="" as={Row}>
          <Col md={{ span: 10, offset: 1 }}>
            <RegistryEntitiesNewMap onMarkerDragEnd={this.saveLatLngToState} />
          </Col>
        </Form.Group>
        <Row>
          <Col>
            <Button type="button" onClick={this.handleClick}>
              Save
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default RegistryEntitiesNew;
