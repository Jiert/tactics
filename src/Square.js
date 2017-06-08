import React, { Component } from 'react';
import {connect} from 'react-redux';
import {addUnit} from './actions';
import Unit from './Unit';


const mapStateToProps = state => ({
  units: state.units,
  unitsByLocation: state.unitsByLocation
});

class Square extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      unit: null,
      key: `${props.square.height}${props.square.width}`,
      location: {
        x: props.square.height,
        y: props.square.width
      }
    }
  }

  getUnit(props) {
    const unitId = props.unitsByLocation && props.unitsByLocation[this.state.key];
    const unit = props.units[unitId];

    return unit;
  }

  componentWillReceiveProps(nextProps) {
    const unit = this.getUnit(nextProps);

    if (unit) {
      this.setState({unit})
    }
  }

  render() {
    return (
      <div className="square">
        {this.props.square.height}, 
        {this.props.square.width} 
        {this.state.unit && <Unit unit={this.state.unit} location={this.location} />}
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Square);
