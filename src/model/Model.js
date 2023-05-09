export class MoveType {
    
    constructor(dr, dc){
        this.deltar = dr;
        this.deltac = dc;
    }   
    
    static parse(s) {
        if ((s === "down")  || (s === "Down"))   { return Down; }
        if ((s === "up")    || (s === "Up"))     { return Up; }
        if ((s === "left")  || (s === "Left"))   { return Left; }
        if ((s === "right") || (s === "Right"))  { return Right; }
        
        return NoMove;
    }
}

export const Down = new MoveType(1, 0, "down");
export const Up = new MoveType(-1, 0, "up");
export const Left = new MoveType(0, -1, "left");
export const Right = new MoveType(0, 1, "right");
export const NoMove = new MoveType(0, 0, "*");  // no move is possible

export class Coordinate {
    
    constructor(row, column){
        this.row = row;
        this.column = column;
    }

}


export default class Model{
    constructor(info){
        this.initialize(info);
        this.info = info;
    }

    initialize(info){
        this.puzzle = new PlanarPuzzle(info);

        var squares = [];
        for (let sq of info.baseSquares) {
            squares.push(new Square(parseInt(sq.row), parseInt(sq.column), (sq.label = 0), sq.color, (sq.isUnused = false)))
        }

        for (let sq of info.unusedSquares) {
            squares.push(new Square(parseInt(sq.row), parseInt(sq.column), (sq.label = 0), sq.color, (sq.isUnused = true)))
        }

        this.puzzle.initialize(squares);
        this.victory = false;
    }

    resetPuzzle(){
        this.initialize(this.info);
    }

    isVictorious() {
        return this.victory;
    }

    copy(){
        let m = new Model(this.info);
        m.puzzle = this.puzzle.clone();
        m.victory = this.victory;
        return m;

    }
}

export class PlanarPuzzle {

    constructor(configuration){
        this.configuration = configuration;
        this.numRows = parseInt(configuration.numRows);
        this.numColumns = parseInt(configuration.numColumns);
        this.selected = null;
    }

    initialize(squares) {
        this.squares = squares.map(sq => sq.copy());
    }

    select(square) {
        this.selected = square;
    }

    isSelected(square){
        return square === this.selected;
    }

    hasWon() {

        //Sees if blank spot on board
        for(let i = 0; i < this.numRows; i++) {
            for(let j = 0; j < this.numColumns; j++){
                
                if(!this.exists(new Square(i, j))){
                    return false;
                }
            }
        }
        
        return (this.highestColors().every(sq => this.neighbors(sq).some(nb => sq.color === nb.color && nb.label === 0)))

    }

    highestColors(){
        let high_c = [];
        this.squares.forEach(sq =>{ if(this.isHighest(sq) && !sq.isUnused){ high_c.push(sq)}});
        return high_c
    }


    neighbors(square){

        let nbs = [];

        this.squares.forEach(sq =>{
            if ((square.row === (sq.row+1) && square.column === sq.column) || //Up
            (square.row === (sq.row-1) && square.column === sq.column) ||  //Down
            (square.row === sq.row && square.column === (sq.column-1)) || //Left
            (square.row === sq.row && square.column === (sq.column+1))){ //Right
                nbs.push(sq);
            }
        });

        return nbs;
    }

    
    //Returns boolean if square already exists in location
    exists(sq) {
        return this.squares.some(square => square.equals(sq));
    }

    isHighest(square) {
        return !this.squares.some(sq => (sq.color === square.color) && (square.label < sq.label));
    }

    isValidExtend(direction) {

        if (!this.selected) {return false;}
        if (direction === NoMove) { return false;}

        let sq = new Square(this.selected.row + direction.deltar, 
                    this.selected.column + direction.deltac);

        return (sq.row < this.numRows && sq.row >= 0 &&
            sq.column < this.numColumns && sq.column >= 0 && 
            !this.exists(sq));
    }

    extendColor(coord, c){
        
        let newr = this.selected.row + coord.deltar;
        let newc = this.selected.column + coord.deltac;
        let sq = new Square(newr, newc, (c.label + 1), c.color, (c.isUnused = false));
        this.selected = sq;
        this.squares.push(sq);
    }

    clone(){
        let copy = new PlanarPuzzle(this.configuration);
        copy.squares = [];
        for (let sq of this.squares) {
            let dup = sq.copy();
            copy.squares.push(dup);
            if (sq === this.selected) { 
                copy.selected = dup;
            }
        }

        return copy;
    }
}

export class Square {

    constructor(row, column, label, color, isUnused){
        this.row = parseInt(row);
        this.column = parseInt(column);
        this.label = label
        this.color = color;
        this.isUnused = isUnused;
    }

    location(){
        return new Coordinate(this.row, this.column)
    }

    equals(square) {
        return this.row === square.row && this.column === square.column;
    }

    place(row, column){
        this.row = row;
        this.column = column;
    }

    //used for solving
    copy() {
        let sq = new Square(this.row, this.column, this.label, this.color, this.isUnused)
        sq.place(this.row, this.column);
        return sq;
    }
}
