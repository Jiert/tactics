import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {addCommander} from './actions';

class Intro extends Component {

  constructor(props) {
    super(props);
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      name: ''
    };
  }

  handleChange(event) {
    this.setState({name: event.target.value});
  }

  getId() {
    return `${Math.random() * 100000000000000000}`;
  }

  handleSubmit(event) {
    event.preventDefault();

    const commander = {
      name: this.state.name,
      id: this.getId()      
    }

    // TODO: These 3 need to all be in a promise chain
    this.context.io.emit('submitPlayerRequest', commander);

    this.props.addCommander(commander);

    try {
      localStorage.setItem('tactics', JSON.stringify(commander))
    } catch (error) {
      console.error()
    }

  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.name} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

Intro.contextTypes = {
  io: PropTypes.object
};

const mapDispatchToProps = dispatch => ({
  addCommander: commander => dispatch(addCommander(commander))
});

export default connect(null, mapDispatchToProps)(Intro);
