import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import * as secrets from '../.secrets'

const LAT_LNG_DIVIDER = 1000000;

class RegistryEntitiesIndexMap extends Component {
  static defaultProps = {
    center: {
      lat: 37.775,
      lng: -122.414
    },
    zoom: 11,
    registry_entities: []
  }

  renderMarkers() {
    let _map = this.state._map
    let _maps = this.state._maps

    let latLngs = this.props.registry_entities.map((registry_entity) => {
      return {
        lat: registry_entity.points[0] / LAT_LNG_DIVIDER,
        lng: registry_entity.points[1] / LAT_LNG_DIVIDER
      }
    })

    latLngs.map(function (latLng) {
      return new _maps.Marker({
        position: {
          lat: latLng.lat,
          lng: latLng.lng
        },
        map: _map
      })
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // REFACTOR: Not the best solution, because 'renderMarkers' function
    // should be called only on 'this.props.registry_entities' change
    // event.
    this.renderMarkers()
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: secrets[process.env.NODE_ENV]["googleMapsKey"] }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          // It is not best way to render markers and use 'onGoogleApiLoaded'
          // for 'google-map-react' library, so this peace of code requires
          // TODO: refactoring to native 'google-map-react' markers like
          // there https://github.com/google-map-react/google-map-react/issues/59
          onGoogleApiLoaded={({ map, maps }) => {
            this.setState({ _map: map, _maps: maps })
            this.renderMarkers()
          }}
        >
        </GoogleMapReact>
      </div>
    );
  }
}

export default RegistryEntitiesIndexMap
