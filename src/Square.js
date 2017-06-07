import React, { Component } from 'react';
import {connect} from 'react-redux';
import {addUnit} from './actions';
import Unit from './Unit';


const mapStateToProps = state => ({
  units: state.units
});

class Square extends Component {

  constructor(props) {
    super(props);
    
    this.selector = `${props.square.height}${props.square.width}`;
    this.state = {
      unit: props.units[this.selector]
    }

    // TODO This is retarded, fix it
    this.location = {
      x: props.square.height,
      y: props.square.width
    }
  }

  componentWillReceiveProps(nextProps) {
    // we should get an isEqual here or something
    this.setState({unit: nextProps.units[this.selector]})
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
