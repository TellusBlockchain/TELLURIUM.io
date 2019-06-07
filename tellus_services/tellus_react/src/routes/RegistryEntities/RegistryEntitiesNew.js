import React from 'react';

import contract from "truffle-contract";
import RegistryEntitiesJSON from "../../contracts/RegistryEntities.json";

import { Row, Col, Form, Button } from 'react-bootstrap';

class RegistryEntitiesNew extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      title: "",
      description: "",
      documents_url: "",
      image_url: "",
      points: [ 1, 2, 3 ]
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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
      deployed.create(
        this.state.title,
        this.state.description,
        this.state.documents_url,
        this.state.image_url,
        this.state.points
      );
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
          <Form.Label column sm={2}>Title:</Form.Label>
          <Col sm={10}>
            <Form.Control type="text"
                          placeholder="Title"
                          name="title"
                          value={this.state.title}
                          onChange={this.handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group controlId="formDescription" as={Row}>
          <Form.Label column sm={2}>Description:</Form.Label>
          <Col sm={10}>
            <Form.Control type="text"
                          placeholder="Description"
                          name="description"
                          value={this.state.description}
                          onChange={this.handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group controlId="formDocumentsUrl" as={Row}>
          <Form.Label column sm={2}>DocumentsUrl:</Form.Label>
          <Col sm={10}>
            <Form.Control type="text"
                          placeholder="DocumentsUrl"
                          name="documents_url"
                          value={this.state.documents_url}
                          onChange={this.handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group controlId="formImageUrl" as={Row}>
          <Form.Label column sm={2}>ImageUrl:</Form.Label>
          <Col sm={10}>
            <Form.Control type="text"
                          placeholder="ImageUrl"
                          name="image_url"
                          value={this.state.image_url}
                          onChange={this.handleInputChange} />
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