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
      name: '',
      submitted: false
    };
  }

  handleChange(event) {
    this.setState({name: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    const commander = {
      name: this.state.name,
      id: JSON.stringify(Date.now()),
      color: this.props.firstPlayer ? 'red' : 'blue'
    };

    // TODO: These 3 need to all be in a promise chain
    this.context.io.emit('submitPlayerRequest', commander);

    this.props.addCommander(commander);

    try {
      localStorage.setItem('tactics', JSON.stringify(commander));
      this.setState({submitted: true});
    } catch (error) {
      console.error(); // eslint-disable-line no-console
    }
  }

  render() {
    if (this.props.connected) {
      if (this.state.submitted) {
        return <p>Waiting for players</p>;
      }

      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }

    return <p>Not connected to server</p>;
  }
}

Intro.contextTypes = {
  io: PropTypes.object
};

Intro.propTypes = {
  addCommander: PropTypes.func.isRequired,
  connected: PropTypes.bool.isRequired,
  firstPlayer: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  firstPlayer: Object.keys(state.players).length === 0,
  connected: state.connected
});

const mapDispatchToProps = dispatch => ({
  addCommander: commander => dispatch(addCommander(commander))
});

export default connect(mapStateToProps, mapDispatchToProps)(Intro);
