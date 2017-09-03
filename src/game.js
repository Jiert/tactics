import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Squares from './squares';
import Menu from './menu';

class Game extends Component {
  componentWillMount() {
    // TODO: We need to make sure that we don't get out
    // of sync when we refresh
    this.context.io.emit('setActivePlayer');
  }

  render() {
    return (
      <div>
        <Squares />
        <Menu />
      </div>
    );
  }
}

Game.contextTypes = {
  io: PropTypes.object
};

export default Game;
