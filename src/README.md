# PlanarPuzzle

Coded by Sam Bryan

## Scripts

You can run from the project directory:

### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test -- --coverage`

To run tests and to see how many statements of the code are covered.

## About the game

The object of the game is to create a "planar path" between each of the same-colored squares and the entire board is filled. Select one of the colors (the initial squares are called "base squares") and a green "halo" will indicate that it is selected. Press the on-screen directional arrows to extend it. Black squares cannot be selected or extended. Extend the square until it touches the other base square. Note to begin with you can select either base square, but after it has been extended, you can only select the highest number of a square. There are three configurations to choose from. There's a reset button if you get stuck. Good luck!

## Problems

An issue that I discovered last minute is that selecting a square does not work if have to scroll down on the larger configurations. If the screen is large enough so that you do not have to scroll down, it should work as I designed it.