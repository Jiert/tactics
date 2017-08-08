import React, {Component} from 'react';
import {connect} from 'react-redux';
import Socket from './Socket';
import Intro from './Intro';
import Game from './Game';
import {addCommander, addOpponent} from './actions';
import isEqual from 'lodash.isequal';

import './App.css';

const mapStateToProps = state => ({
  commander: state.commander,
  opponent: state.opponent,
  players: state.players
})

const mapDispatchToProps = dispatch => ({
  addCommander: commander => dispatch(addCommander(commander)),
  addOpponent: opponent => dispatch(addOpponent(opponent))
});

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
      console.error(error);
    }
  }

  setOpponent(props) {
    const playerIds = Object.keys(props.players);

    playerIds.forEach(id => {
      if (id !== this.props.commander.id) {
        this.props.addOpponent(props.players[id])
      }
    })
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
      <div className="App">
        <Socket>
          {this.playersReady() 
            ? <Game />  
            : <Intro />}
        </Socket>
      </div>
    );
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
