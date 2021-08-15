//======================================================================================================================
// IMPORTS
import { Deck } from "../../deck.js";
import { TileAdjacencyList } from "../tileadjacencylist.js";
import { TileType, Ports } from "../board.js";
//======================================================================================================================



//======================================================================================================================
/**
 * @file    standard.js
 * @author  cammatsui
 * @date    2021
 */
//======================================================================================================================



//======================================================================================================================
/**
 * Objects describing the standard board setup.
 */
var standardSetup = {
//======================================================================================================================



    boardPieces : {},
    //==================================================================================================================
    /**
     * The structure for the standard setup.
     */
    boardStructure : {
        tileAdjacencies : [
            new TileAdjacencyList([-1, 1, 12, 11, -1, -1]), // 0
            new TileAdjacencyList([-1, 2, 13, 12, 0, -1]),  // 1
            new TileAdjacencyList([-1, -1, 3, 13, 1, -1]),  // 2
            new TileAdjacencyList([-1, -1, 4, 14, 13, 2]),  // 3
            new TileAdjacencyList([-1, -1, -1, 5, 14, 3]),  // 4
            new TileAdjacencyList([4, -1, -1, 6, 15, 14]),  // 5
            new TileAdjacencyList([5, -1, -1, -1, 7, 15]),  // 6
            new TileAdjacencyList([15, 6, -1, -1, 8, 16]),  // 7
            new TileAdjacencyList([16, 7, -1, -1, -1, 9]),  // 8
            new TileAdjacencyList([17, 16, 8, -1, -1, 10]), // 9
            new TileAdjacencyList([11, 17, 9, -1, -1, -1]), // 10
            new TileAdjacencyList([0, 12, 17, 10, -1, -1]), // 11
            new TileAdjacencyList([1, 13, 18, 17, 11, 0]),  // 12
            new TileAdjacencyList([2, 3, 14, 18, 12, 1]),   // 13
            new TileAdjacencyList([3, 4, 5, 15, 18, 13]),   // 14
            new TileAdjacencyList([14, 5, 6, 7, 16, 18]),   // 15
            new TileAdjacencyList([18, 15, 7, 8, 9, 17]),   // 16
            new TileAdjacencyList([12, 18, 16, 9, 10, 11]), // 17
            new TileAdjacencyList([12, 13, 14, 15, 16, 17]) // 18
        ],
        deserts         : [18],
        portSpots       : [
            [0, 5],
            [1, 0],
            [3, 0],
            [4, 1],
            [5, 2],
            [7, 2],
            [8, 3],
            [9, 4],
            [11, 4]
        ]
    } // boardStructure
    //==================================================================================================================


//======================================================================================================================
}; // var standardSetup
//======================================================================================================================



//======================================================================================================================
/**
 * Populate the <code>Deck</code>s for <code>boardPieces</code> and return <code>standardSetup</code>.
 * 
 * @returns The <code>standardSetup</code> object.
 */
export function getStandardSetup() {
    standardSetup.boardPieces = {
        tileDeck : Deck.deckFromArr([
            TileType.BRICK, TileType.BRICK, TileType.BRICK, 
            TileType.LUMBER, TileType.LUMBER, TileType.LUMBER, TileType.LUMBER,
            TileType.WOOL, TileType.WOOL, TileType.WOOL, TileType.WOOL,
            TileType.GRAIN, TileType.GRAIN, TileType.GRAIN, TileType.GRAIN,
            TileType.ORE, TileType.ORE, TileType.ORE,
        ]),
        numberDeck : Deck.deckFromArr([2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]),
        portDeck : Deck.deckFromArr([
            Ports.MYSTERY, Ports.WOOL, Ports.MYSTERY, Ports.MYSTERY, Ports.BRICK, Ports.LUMBER, Ports.MYSTERY,
            Ports.GRAIN, Ports.ORE
        ])
    };
    return standardSetup;
} // getStandardSetup ()
//======================================================================================================================