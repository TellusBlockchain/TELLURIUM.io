import React from 'react';

import contract from "truffle-contract";
import RegistryEntitiesJSON from "../../contracts/RegistryEntities.json";

import { Row, Col, Form, Button } from 'react-bootstrap';

import ipfsClient from 'ipfs-http-client';

import RegistryEntitiesNewMap from "../../components/RegistryEntitiesNewMap";
import AboveTheMapWindow from "../../components/AboveTheMapWindow";

const LAT_LNG_DIVIDER = 1000000;
const LAT_INITIAL = 37770658;
const LONG_INITIAL = -122414000;

class RegistryEntitiesNew extends React.Component {
  constructor (props) {
    super(props);

    let opts = process.env.NODE_ENV === 'production' ? { protocol: 'https' } : {}
    this.ipfs = ipfsClient(
      process.env.REACT_APP_IPFS_API_SERVER_URL,
      process.env.REACT_APP_IPFS_API_SERVER_PORT,
      opts
    );

    this.state = {
      title: '',
      description: '',
      documents_url: '',
      image_url: '',
      priceUSD: '',
      documents_files: [],
      images_files: [],
      points: [ LAT_INITIAL, LONG_INITIAL, 0 ]
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
    this.setState({ documents_files: event.target.files })
  }

  async saveToIpfsDocuments (files) {
    return this.ipfs.add([...files], { progress: (prog) => console.log(`received: ${prog}`) })
  }

  upload_image (event) {
    event.stopPropagation()
    event.preventDefault()
    this.setState({ images_files: event.target.files })
  }

  async saveToIpfsImage (files) {
    return this.ipfs.add([...files], { progress: (prog) => console.log(`received: ${prog}`) })
  }

  saveLatLngToState(latLng) {
    this.setState({
      points: [
        Math.round(latLng.lat*LAT_LNG_DIVIDER),
        Math.round(latLng.lng*LAT_LNG_DIVIDER),
        0
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

      let response, ipfsId;
      try {
        response = await this.saveToIpfsDocuments(this.state.documents_files)
        console.log(response)
        ipfsId = response[0].hash
        console.log(ipfsId)
        this.setState({
          documents_url: `${process.env.REACT_APP_IPFS_GATEWAY_URL}/ipfs/${ipfsId}`
        })
      } catch (err) {
        console.error(err)
      }

      try {
        response = await this.saveToIpfsImage(this.state.images_files)
        console.log(response)
        ipfsId = response[0].hash
        console.log(ipfsId)
        this.setState({
          image_url: `${process.env.REACT_APP_IPFS_GATEWAY_URL}/ipfs/${ipfsId}`
        })
      } catch (err) {
        console.error(err)
      }

      const deployed = await RegistryEntities.deployed();
      await deployed.create(
        this.state.title,
        this.state.description,
        this.state.documents_url,
        this.state.image_url,
        this.state.priceUSD,
        this.state.points,
        { value: 100000000000000000 }
      );
      
      this.props.history.push('/registry_entities')
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
      <>
        <div className='map-container'>
          <RegistryEntitiesNewMap onMarkerDragEnd={this.saveLatLngToState} />
        </div>
        <AboveTheMapWindow style={{ padding: '30px' }}>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title:</Form.Label>
              <Form.Control type="text"
                            placeholder="Title"
                            name="title"
                            value={this.state.title}
                            onChange={this.handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description:</Form.Label>
              <Form.Control as="textarea"
                            placeholder="Description"
                            name="description"
                            value={this.state.description}
                            onChange={this.handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formPriceUSD">
              <Form.Label>PriceUSD:</Form.Label>
              <Form.Control type="text"
                            placeholder="Price in USD"
                            name="priceUSD"
                            value={this.state.priceUSD}
                            onChange={this.handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formDocumentsUrl">
              <Form.Label>Upload Documents:</Form.Label>
              <Form.Control type="file"
                            name="documents_url"
                            onChange={this.upload_documents} />
            </Form.Group>
            <Form.Group controlId="formImageUrl">
              <Form.Label>Upload Image:</Form.Label>
              <Form.Control type="file"
                            name="image_url"
                            onChange={this.upload_image} />
            </Form.Group>
            <Form.Group controlId="formPoints">
              <Form.Label>Coordinates:</Form.Label>
              <div>
                Lat: {this.state.points[0]/LAT_LNG_DIVIDER}
              </div>
              <div>
                Lng: {this.state.points[1]/LAT_LNG_DIVIDER}
              </div>
              <div>
                Z: {this.state.points[2]}
              </div>
            </Form.Group>
            <Row>
              <Col>
                <Button type="button" onClick={this.handleClick}>
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </AboveTheMapWindow>
      </>
    );
  }
}

export default RegistryEntitiesNew;
