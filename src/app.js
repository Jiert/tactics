import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import isEqual from 'lodash.isequal';
import styled from 'styled-components';

import Socket from './socket';
import Intro from './intro';
import Game from './game';
import {addCommander, addOpponent} from './actions';

const mapStateToProps = state => ({
  commander: state.commander,
  connected: state.connected,
  opponent: state.opponent,
  players: state.players
});

const mapDispatchToProps = dispatch => ({
  addCommander: commander => dispatch(addCommander(commander)),
  addOpponent: opponent => dispatch(addOpponent(opponent))
});

const Wrapper = styled.div`font-family: sans-serif;`;

class App extends Component {
  constructor(props) {
    super(props);

    this.playersReady = this.playersReady.bind(this);
    this.setOpponent = this.setOpponent.bind(this);
  }

  componentWillMount() {
    try {
      const tactics = localStorage.tactics;
      const commander = tactics && JSON.parse(tactics);
      if (commander) {
        this.props.addCommander(commander);
      }
    } catch (error) {
      console.error(error); //eslint-disable-line no-console
    }
  }

  setOpponent(props) {
    const playerIds = Object.keys(props.players);

    playerIds.forEach(id => {
      if (id !== this.props.commander.id) {
        this.props.addOpponent(props.players[id]);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    // This is totally lame, but we're doing it for now 2 players only
    // TODO: a better way to manage opponents
    if (!isEqual(nextProps.players, this.props.players)) {
      this.setOpponent(nextProps);
    }
  }

  playersReady() {
    return this.props.commander.id && this.props.opponent.id;
  }

  render() {
    return (
      <Wrapper>
        <Socket>
          {this.props.connected && this.playersReady() ? <Game /> : <Intro />}
        </Socket>
      </Wrapper>
    );
  }
}

App.propTypes = {
  addCommander: PropTypes.func.isRequired,
  addOpponent: PropTypes.func.isRequired,
  commander: PropTypes.object.isRequired,
  connected: PropTypes.bool.isRequired,
  players: PropTypes.object.isRequired,
  opponent: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
