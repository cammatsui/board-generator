//======================================================================================================================
// IMPORTS
import { Board } from "./board/board.js";
import { Deck } from  "./deck.js";
import { getRandomNumbers } from  "./utils.js";
//======================================================================================================================



//======================================================================================================================
/**
 * @file    boardgenerator.js
 * @author  cammatsui
 * @date    2021
 */
//======================================================================================================================



//======================================================================================================================
/**
 * An object to generate a <code>Board</code> according to the chosen algorithms/specifications.
 */
export class BoardGenerator {
//======================================================================================================================



    //==================================================================================================================
    /**
     * Constructor for a <code>BoardGenerator</code>.
     * 
     * @param {*} tileAlgorithm An object representing the algorithm to use for placing tiles. Should have attributes
     * <code>name</code>, a string corresponding to the algorithm, and in some cases <code>p</code>, a float between 0
     * and 1 which is a parameter of the tile placement algorithm.
     * @param {*} numberAlgorithm An object representing the algorithm to use for placing numbers. Should have 
     * attributes <code>name</code>, a string corresponding to the algorithm, and in some cases <code>p</code>, a float
     * between 0 and 1 which is a parameter of the number placement algorithm.
     * @param {*} desertAlgorith An object representing the algorithm to use for placing deserts. Should have 
     * attribute <code>name</code>, a string corresponding to the algorithm.
     * @param {*} portAlgorithm An object representing the algorithm to use for placing ports. Should have 
     * attribute <code>name</code>, a string corresponding to the algorithm.
     * @param {*} boardPieces An object representing pieces to place onto the <code>Board</code>. Should have attributes 
     * <code>tileDeck</code>, <code>numberDeck</code>, and <code>portDeck</code>.
     * @param {*} boardStructure An object representing the <code>Board</code> structure. Should have attributes
     * <code>tileAdjacencies</code>, <code>deserts</code>, and <code>ports</code>.
     */
    constructor(tileAlgorithm, numberAlgorithm, desertAlgorithm, portAlgorithm, boardPieces, boardStructure) {
        this.tileAlgorithm = tileAlgorithm;
        this.numberAlgorithm = numberAlgorithm;
        this.desertAlgorithm = desertAlgorithm;
        this.portAlgorithm = portAlgorithm;
        this.boardPieces = boardPieces;
        this.boardStructure = boardStructure;
        this.board = new Board(this.boardStructure.tileAdjacencies, this.boardStructure.deserts,
            this.boardStructure.portSpots);
        this.generatedTiles = false;
        this.numIters = 500;
    } // constructor ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Generate the <code>Board</code> according to this <code>BoardGenerator</code>'s fields.
     */
    generateBoard() {
        this.generateDeserts();
        this.generateTiles();
        this.generateNumbers();
        this.generatePorts();
    } // generateBoard ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Place the tiles based on this <code>BoardGenerator</code>'s <code>tileAlgorithm</code> field.
     */
    generateTiles() {
        switch (this.tileAlgorithm.name) {
            case "random":
                this.board.randomTileSetup(this.boardPieces.tileDeck);
                break;
            case "clumped":
                this.board.clumpedTileSetup(this.boardPieces.tileDeck, this.tileAlgorithm.p);
                break;
            default:
                throw "invalid tile algorithm name";
        }
        this.generatedTiles = true;
    } // generateTiles ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Place the numbers based on this <code>BoardGenerator</code>'s <code>numberAlgorithm</code> field.
     */
    generateNumbers() {
        if (!this.generatedTiles) throw "Must generate tiles before numbers.";
        switch (this.numberAlgorithm.name) {
            case "random":
                this.board.randomNumberSetup(this.boardPieces.numberDeck);
                break;
            case "pseudorandom":
                this.board.randomNumberSetupNoAdjacentReds(this.boardPieces.numberDeck);
                break;
            case "resource-variance":
                this.generateNumbersVariance(this.numberAlgorithm.p, 'Resource');
                break;
            case "settlement-resource-variance":
                this.generateNumbersVariance(this.numberAlgorithm.p, 'SettlementResource');
                break;
            default:
                throw "invalid number algorithm name";
        }
    } // generateNumbers ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Place down the ports based on this <code>BoardGenerator</code>'s <code>portAlgorithm</code> field.
     */
    generatePorts() {
        if (!this.generatedTiles) throw "Must generate tiles before ports.";
        switch (this.portAlgorithm.name) {
            case "random":
                this.board.randomPortSetup(this.boardPieces.portDeck);
                break;
            case "preset":
                this.board.ports = this.boardPieces.portDeck;
                break;
            case "default":
                throw "invalid port algorithm name";
        }
    } // generatePorts ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Place down the deserts based on this <code>BoardGenerator</code>'s <code>desertAlgorithm</code> field.
     */
    generateDeserts() {
        switch (this.desertAlgorithm.name) {
            case "centered":
                this.board.deserts = this.boardStructure.deserts;
                break;
            case "random":
                var numDeserts = this.boardStructure.deserts.length;
                this.board.deserts = getRandomNumbers(this.boardStructure.tileAdjacencies.length, numDeserts);
                break;
            case "default":
                throw "invalid desert algorithm name";
        }
    } // generateDeserts ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * The variance number placement algorithm. Generates <code>numIters</code> number placements, sorts them
     * by the specified variance in resource availability in ascending order, and sets the <code>Board</code>'s number 
     * placement to the <code>1-p</code>th percentile of these generated number placements.
     * 
     * @param {*} p The percentile, as described. Lower <code>p</code> => less balanced, higher <code>p</code> =>
     * more balanced.
     * @param {*} varianceType Either 'Resource' or 'SettlementResource'.
     */
    generateNumbersVariance(p, varianceType) {
        var generatedTileNumbers = [];
        this.board.initializeSettlementSpots();
        // Generate numIters boards.
        for (var i = 0; i < this.numIters; i++) {
            // Save the numbers.
            var savedNumbers = JSON.parse(JSON.stringify(this.boardPieces.numberDeck));
            var savedNumbersDeck = new Deck();
            for (var j = 0; j < savedNumbers.length; j++) savedNumbersDeck.push(savedNumbers[j]);

            this.board.randomNumberSetup(this.boardPieces.numberDeck);
            this.board['calculate'+varianceType+'Variance']();

            this.boardPieces.numberDeck = savedNumbersDeck;
            var thisTileNumbers = {
                numbers  : JSON.parse(JSON.stringify(this.board.tileNumbers)),
                variance : this.board[varianceType+'Variance']
            };
            generatedTileNumbers.push(thisTileNumbers);
        }
        // Sort the tileNumbers by variance from low (balanced) to high (unbalanced).
        generatedTileNumbers.sort((a, b) => (a.variance > b.variance) ? 1 : -1);
        var choiceTileNumberIndex = Math.max(Math.floor((1-p) * this.numIters)-1, 0); 
        this.board.tileNumbers = generatedTileNumbers[choiceTileNumberIndex].numbers;
    } //generateNumbersVariance ()
    //==================================================================================================================



//======================================================================================================================
} // class BoardGenerator
//======================================================================================================================