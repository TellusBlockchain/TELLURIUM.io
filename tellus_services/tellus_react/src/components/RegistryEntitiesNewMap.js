import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'

class RegistryEntitiesNewMap extends Component {
  static defaultProps = {
    center: {
      lat: 37.775,
      lng: -122.414
    },
    zoom: 11
  }

  renderMarkers(map, maps, onMarkerDragEnd) {
    const marker = new maps.Marker({
      position: {
        lat: 37.775,
        lng: -122.414
      },
      map,
      draggable: true
    })

    const markerListener = marker.addListener("dragend", (ev) => {
      onMarkerDragEnd({ lat: ev.latLng.lat(), lng: ev.latLng.lng() });
    })

    this.setState({
      markerListener: markerListener
    })
  }

  componentWillUnmount() {
    this.state.markerListener.remove()
  }

  render() {
    return (
      <div style={{ width: '100%', height: '480px' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDbqXZerRwHyXrq8EIm488aJLmuBZ2J0Jg" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          // It is not best way to render markers and use 'onGoogleApiLoaded'
          // for 'google-map-react' library, so this peace of code requires
          // TODO: refactoring to native 'google-map-react' library markers like
          // there https://github.com/google-map-react/google-map-react/issues/59
          onGoogleApiLoaded={({ map, maps }) => {
            this.renderMarkers(map, maps, this.props.onMarkerDragEnd)
          }}
        >
        </GoogleMapReact>
      </div>
    )
  }
}

export default RegistryEntitiesNewMap
