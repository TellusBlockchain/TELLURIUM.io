import React from 'react';

class AboveTheMapWindow extends React.Component {
  render () {
    return (
      <div className="registry-entities-container" style={this.props.style}>
        {
          this.props.children
        }
      </div>
    )
  }
}

export default AboveTheMapWindow;