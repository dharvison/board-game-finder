# Board Game Finder

Board Game Finder ([Bored?] Game Finder) allows you to find new and trending games, manager your board game collection and find local players for your game night!

[Check out Board Game Finder](https://board-game-finder-0f8d2ba65338.herokuapp.com/)


## Features

1. Browse hot and trending board games or search for games to play
2. Track your game selection and games you want to play with smart lists
3. Manually organize your games with lists of your own design
4. Keep notes on the games you play and games you're looking to try out
5. Search for players in your area to organize a game night or messages users who want to play a specific game you're interested in

I chose these features because they will help me organize my game collection and keep track of the games I hope to play soon. Board Game Finder was designed to be the game website I want to use. I'm always looking to try out a new game, and connect with people who love board games in my area.


## Basic Flow

1. Create and account
2. Search for board games or browse the trending games
3. Add a note for a game you own or wish to play
4. Search for and create a list of your favorite games
5. Look for players in your city who want to play one of your games


## Setup & Run

After checking out project there a few steps to get it running.

### Backend

1. In the backend directory run `npm -i`
2. Initialize your database with `psql < bgf.sql`
3. Start the backend via `node server.js`

This will start the app running locally. The default port is `3001`. A `get` request to `localhost:3001` will return `{"error":{"message":"Not Found","status":404}}` if the app is running.

You can then use make requests to test out the backend or move on to the Frontend.

### Frontend

1. In the frontend directory run `npm -i`
2. Start the frontend via `npm start`

This will start the the web server. The default port is `3000`. Navigating to `localhost:3000` should display the home page.


## Tests

Test are implemented via jest as *.test.js and can be run from the directories with `npm test`.


## API Information

[Proposal and API](proposal/proposal.md)


## Tech Stack

Board Game Finder is built using JavaScript, React and Node.

* React and Bootstrap for the frontend
* Node and PostgreSQL for the backend
