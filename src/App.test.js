import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import Model, { Coordinate } from './model/Model.js';
import { extendColor, selectSquare, resetPuzzle } from './controller/Controller';
import { configuration_1 } from './model/Configurations.js';
import { Up, Down, Left, Right} from './model/Model.js'


var actualPuzzle = JSON.parse(JSON.stringify(configuration_1));   // parses string into JSON object, used below.

test('Establish correct number of base squares', () => {

  var model = new Model(actualPuzzle);

  expect(model.puzzle.squares.length).toBe(4)
});

test('Num columns of configuration 1', () => {

  var model = new Model(actualPuzzle);
  expect(model.puzzle.numColumns).toBe(4)

});

test('First valid moves', () => {

  var model = new Model(actualPuzzle);
  var sq = model.puzzle.squares.find(square => square.row == 0 && square.column == 0);

  model.puzzle.select(sq);

  expect(model.puzzle.selected).toBe(sq);
  expect(model.puzzle.neighbors(sq).length).toBe(0);
  expect(model.puzzle.isValidExtend(Up)).toBe(false);
  expect(model.puzzle.isValidExtend(Down)).toBe(true);
  expect(model.puzzle.isValidExtend(Left)).toBe(false);
  expect(model.puzzle.isValidExtend(Right)).toBe(true);
});

test('Click selects a square', () => {

  var model = new Model(actualPuzzle);
  
  class Event {
    constructor(x, y){
      this.clientX = x;
      this.clientY = y;
    }
  }

  //Selects known square
  let e = new Event(50, 50);
  var newModel = selectSquare(model, null, e);
  var sq = model.puzzle.squares.find(square => square.row === 0 && square.column === 0);
  expect(newModel.puzzle.selected).toStrictEqual(sq);

  //Clicks canvas where there is no square
  let e2 = new Event(150, 50)
  var newModel_2 = selectSquare(model, null, e2);

  expect(newModel_2.puzzle.selected).toStrictEqual(null);
});

test('Extend color', () => {

  var model = new Model(actualPuzzle);

  let initialSelect = model.puzzle.squares.find(sq => sq.row == 0 && sq.column == 0);

  model.puzzle.select(initialSelect);

  var newModel = extendColor(model, Down);

  let target = model.puzzle.squares.find(sq => sq.row == 1 && sq.column == 0)
  
  expect(newModel.puzzle.selected).toStrictEqual(target);
  expect(JSON.stringify(newModel.puzzle.neighbors(initialSelect))).toBe("["+JSON.stringify(newModel.puzzle.selected)+"]")


});

test('Access GUI', () => {
  const { getByText } = render(<App />);

  const upButton = screen.getByTestId('upbutton');
  const downButton = screen.getByTestId('downbutton');
  const leftButton = screen.getByTestId('leftbutton');
  const rightButton = screen.getByTestId('rightbutton');
  
  const canvasElement = screen.getByTestId('canvas');

  // initially, all buttons are disabled
  expect(upButton.disabled).toBeTruthy()
  expect(downButton.disabled).toBeTruthy()
  expect(leftButton.disabled).toBeTruthy()
  expect(rightButton.disabled).toBeTruthy()

  // Selects square in configuration_1 at position 0,0
  fireEvent.click(canvasElement, { screenX: 50, screenY: 50, clientX:50, clientY: 50} )

   // Now buttons show can extend down or right
  expect(upButton.disabled).toBeTruthy()
  expect(downButton.disabled).toBeFalsy()
  expect(leftButton.disabled).toBeTruthy()
  expect(rightButton.disabled).toBeFalsy()

   // Moves down
   fireEvent.click(downButton);

   // Can no longer extend down
   expect(downButton.disabled).toBeTruthy()
});

test('Configuration 1 game played in full', () => {
  
  var model = new Model(actualPuzzle);

  //Selects (red) square at position 0, 0
  let s1 = model.puzzle.squares.find(sq => sq.row === 0 && sq.column === 0);
  model.puzzle.select(s1);

  //Creates planar path for square (red)
  extendColor(model, Down);
  extendColor(model, Right);
  extendColor(model, Up);

  //Selects (orange) square at position 1,2
  let s2 = model.puzzle.squares.find(sq => sq.row === 1 && sq.column === 2);
  model.puzzle.select(s2);

  //Creates planar path for square (orange)
  extendColor(model, Right);

  //Game is won
  expect(model.isVictorious()).toBeTruthy();
});

test('Test coordinate', () => {
  var model = new Model(actualPuzzle);

  //Select square at 0,0
  let square = model.puzzle.squares.find(sq => sq.row == 0 && sq.column == 0);
  let coor = new Coordinate(0, 0);

  expect(coor.row).toBe(0);
  expect(coor.column).toBe(0);
  expect(square.location()).toStrictEqual(coor);

});

test('Reset puzzle', () => {
  var model = new Model(actualPuzzle);
  var original_model = new Model(actualPuzzle);
  var assert = require('assert');

  //Selects square at 0,0
  let square = model.puzzle.squares.find(sq => sq.row == 0 && sq.column == 0);
  model.puzzle.select(square);

  //Creates a planar path
  model = extendColor(model, Down);
  model = extendColor(model, Right);
  model = extendColor(model, Up);

  //Makes sure puzzle has been modified
  assert.notStrictEqual(model, original_model);

  //Resets puzzle
  let reset_model = resetPuzzle(model);

  //Makes sure that puzzle is equal to original
  expect(reset_model).toStrictEqual(original_model);
});