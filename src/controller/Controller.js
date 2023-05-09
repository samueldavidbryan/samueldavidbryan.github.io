export function selectSquare(model, canvas, event) {
    // const canvasSq = canvas.getBoundingClientRect();

    // find piece on which mouse was clicked
    let idx = model.puzzle.squares.findIndex(square => {

        let width = 100;

        return (((event.clientX >= parseInt(square.column)*width) && (event.clientX <= parseInt(square.column)*width + width)) 
            && ((event.clientY >= parseInt(square.row)*width) && (event.clientY <= parseInt(square.row)*width + width))) 
    });
        

    let selected = null

    if (idx >= 0){
        selected = model.puzzle.squares[idx];
    }

    // Selects this piece! Construct new model to represent this situation
    model.puzzle.select(selected);
    return model.copy();
}

export function extendColor(model, direction) {
    let selected = model.puzzle.selected;
    if (!selected){ return model; }

    model.puzzle.extendColor(direction, model.puzzle.selected);
    model.victory = model.puzzle.hasWon();

    return model.copy();
}

export function resetPuzzle(model) {
    model.resetPuzzle()

    return model.copy()
}