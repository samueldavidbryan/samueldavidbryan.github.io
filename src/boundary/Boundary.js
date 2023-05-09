var BOXSIZE = 100;
const OFFSET = 8;

export function drawPuzzle(ctx, puzzle, showLabels) {
    
    ctx.shadowColor = 'black';

    puzzle.squares.forEach(square => {

        if (puzzle.isSelected(square) && !square.isUnused && puzzle.isHighest(square)) {
            // ctx.fillStyle = 'lime';
            ctx.lineWidth = "7";
            ctx.strokeStyle = "lime";
            ctx.strokeRect(square.column*BOXSIZE - OFFSET/2, square.row*BOXSIZE - OFFSET/2, BOXSIZE, BOXSIZE);
        }
        
        ctx.fillStyle = square.color;

        ctx.shadowBlur = 10;
        ctx.fillRect(square.column*BOXSIZE, square.row*BOXSIZE, BOXSIZE - OFFSET, BOXSIZE - OFFSET)

        if (!square.isUnused) {
            
            ctx.textAlign="center"; 
            ctx.textBaseline = "middle";
            ctx.font = "20px Arial";
            ctx.fillStyle = "white";

            let text = "";
            
            if (square.label === 0) {
                text = square.color;
            } else {
                text = square.label;
            }

            ctx.fillText(text, square.column*BOXSIZE + BOXSIZE/2, square.row*BOXSIZE + BOXSIZE/2)
        }

    });

}


export function redrawCanvas(model, canvasObj, appObj) {
    if (typeof canvasObj === 'undefined') { return; } //For testing
    
    const ctx = canvasObj.getContext('2d');
    if (ctx === null){ return; }

    ctx.clearRect(0,0, canvasObj.width, canvasObj.height);

    if (model.puzzle) {
        drawPuzzle(ctx, model.puzzle, model.showLabels);
    }
}