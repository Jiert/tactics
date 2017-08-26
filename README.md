# Tactics 

[![Build Status](https://travis-ci.org/Jiert/tactics.svg?branch=master)](https://travis-ci.org/Jiert/tactics)

An experiment in creating a turn-based RPG similar to CIV, that focuses on military tactics.

### Running the Client
To get started, clone this repo into a directory. `cd` into it and run `npm install`.

When the install is complete, run `npm start`.

### Running the server
Head over to [tactics-server](https://github.com/jiert/tactics-server) and clone it into a directory, and from its directory run `node index.js`.

### Playing the game
Now you should be able to navigate to `localhost:3000` in a (chrome) browser and see a simple text input form. You need to enter something here to become "Player 1"

Now we just need a "Player 2 so open up a new incognito browser tab, and navigate to locoalhost:3000 again. You should see the same text input.

Once you enter the secone name, the game should load.

It's very rudimentary right now, but you'll see a game board. You can create a unit and then select the unit and move it around the board.
