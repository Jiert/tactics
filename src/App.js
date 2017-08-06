import React, {Component} from 'react';
import Socket from './Socket';
import Game from './Game';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      userName: '',
      userId: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    try {
      const tactics = localStorage.tactics;
      const localState = tactics && JSON.parse(tactics);

      if (localStorage) {
        this.setState(localState)
      }
    } catch (error) {
      //
    }
  }

  handleChange(event) {
    this.setState({userName: event.target.value});
  }

  getId() {
    return `${Math.random () * 100000000000000000}`;
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      userId: this.getId()
    }, () => {
      localStorage.setItem('tactics', JSON.stringify(this.state))
    });
  }

  renderIntro() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }

  render() {
    return (
      <div className="App">
        <Socket>
          {this.state.userId ? <Game />  : this.renderIntro()}
        </Socket>
      </div>
    );
  }
};

export default App;
