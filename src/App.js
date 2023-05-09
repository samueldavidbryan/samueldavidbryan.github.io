import React from 'react';
import Model from './model/Model.js'
import { layout } from './Layout.js';
import { configuration_1, configuration_2, configuration_3 } from './model/Configurations.js';
import { redrawCanvas } from './boundary/Boundary.js';
import { selectSquare, extendColor, resetPuzzle } from './controller/Controller.js';

import { Up, Down, Left, Right } from './model/Model.js'



function App() {

  const [actualPuzzle, setConfig] = React.useState(JSON.parse(JSON.stringify(configuration_1)))

  // Initial instatiation of the model
  const [model, setModel] = React.useState(new Model(actualPuzzle));

  const appRef = React.useRef(null); //To refer to App
  const canvasRef = React.useRef(null); //To refer to Canvas

  /* Ensures initial renduring is performed, and that whenever the model changes
  it is re-rendered*/
  React.useEffect(() => {
    
    /* Happens once */
    redrawCanvas(model, canvasRef.current, appRef.current);
  }, [model]) // Second argument is critical since it declares when to refresh

  const handleClick = (e) => {
    // console.log(e.screenX, e.screenY, e.clientX, e.clientY);
    let newModel = selectSquare(model, canvasRef.current, e);
    setModel(newModel); //react to changes, if model has changed
  }

  const extendSquareHandler = (direction) => {
    let newModel = extendColor(model, direction);
    setModel(newModel); //react to changes, if model has changed
  }

  const configHandler = (config) => {
    let newPuzzle = JSON.parse(JSON.stringify(config));
    setConfig(newPuzzle);
    let newModel = new Model(newPuzzle);
    setModel(newModel);
  }

  const resetHandler = () => {
   let newModel = resetPuzzle(model);
   setModel(newModel);

  }

  return (
    <main style={layout.Appmain} ref ={appRef}>
      <div style={layout.sidebar}>
        <button style = {layout.reset} onClick={(e) => resetHandler()}>Reset Puzzle</button>
        
        <div style={layout.configuration}>
          <button onClick={(e) => configHandler(configuration_1)}>Level 1</button>
          <button onClick={(e) => configHandler(configuration_2)}>Level 2</button>
          <button onClick={(e) => configHandler(configuration_3)}>Level 3</button>
        </div>
        
        <div style={layout.directionButtons}>
          <button data-testid="upbutton" style = {layout.upbutton} onClick={(e) => extendSquareHandler(Up)} disabled={!model.puzzle.isValidExtend(Up)}>&and;</button>
          <button data-testid="downbutton" style = {layout.downbutton} onClick={(e) => extendSquareHandler(Down)} disabled={!model.puzzle.isValidExtend(Down)}>&or;</button>
          <button data-testid="leftbutton" style = {layout.leftbutton} onClick={(e) => extendSquareHandler(Left)} disabled={!model.puzzle.isValidExtend(Left)}>&lt;</button>
          <button data-testid="rightbutton" style = {layout.rightbutton} onClick={(e) => extendSquareHandler(Right)} disabled={!model.puzzle.isValidExtend(Right)}>&gt;</button>
        </div>

      { model.isVictorious() && <label align="center" style={layout.victory}>Congratulations! You've won!</label> }
      </div>
      
      <canvas className = "App-canvas"
      style={layout.canvas}
      ref={canvasRef}
      width = {String(100*(model.puzzle.numColumns))}
      height = {String(100*(model.puzzle.numRows))}
      backgroundcolor = {layout.canvas.backgroundColor}
      onClick={handleClick}
      data-testid="canvas">
      </canvas>
      
    </main>

    
  );
}

export default App;
