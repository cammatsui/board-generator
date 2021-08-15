//======================================================================================================================
// IMPORTS
import { Deck } from "../../deck.js";
import { TileAdjacencyList } from "../tileadjacencylist.js";
import { TileType, Ports } from "../board.js";
//======================================================================================================================



//======================================================================================================================
/**
 * @file    expansion.js
 * @author  cammatsui
 * @date    2021
 */
//======================================================================================================================



//======================================================================================================================
/**
 * Objects describing the 6-player expansion board setup.
 */
var expansionSetup = {
//======================================================================================================================



    //==================================================================================================================
    /**
     * The structure for the regular setup.
     */
    boardStructure : {
        tileAdjacencies : [
            new TileAdjacencyList([-1, 1, 16, 15, -1, -1]),  // 0
            new TileAdjacencyList([-1, 2, 17, 16, 0, -1]),   // 1
            new TileAdjacencyList([-1, -1, 3, 17, 1, -1]),   // 2
            new TileAdjacencyList([-1, -1, 4, 18, 17, 2]),   // 3
            new TileAdjacencyList([-1, -1, 5, 19, 18, 3]),   // 4
            new TileAdjacencyList([-1, -1, -1, 6, 19, 4]),   // 5
            new TileAdjacencyList([5, -1, -1, 7, 20, 19]),   // 6
            new TileAdjacencyList([6, -1, -1, 8, 21, 20]),   // 7
            new TileAdjacencyList([7, -1, -1, -1, 9, 21]),   // 8
            new TileAdjacencyList([21, 8, -1, -1, 10, 22]),  // 9
            new TileAdjacencyList([22, 9, -1, -1, -1, 11]),  // 10
            new TileAdjacencyList([23, 22, 10, -1, -1, 12]), // 11
            new TileAdjacencyList([24, 23, 11, -1, -1, 13]), // 12
            new TileAdjacencyList([14, 24, 12, -1, -1, -1]), // 13
            new TileAdjacencyList([15, 25, 24, 13, -1, -1]), // 14
            new TileAdjacencyList([0, 16, 25, 14, -1, -1]),  // 15
            new TileAdjacencyList([1, 17, 26, 25, 15, 0]),   // 16
            new TileAdjacencyList([2, 3, 18, 26, 16, 1]),    // 17
            new TileAdjacencyList([3, 4, 19, 27, 26, 17]),   // 18
            new TileAdjacencyList([4, 5, 6, 20, 27, 18]),    // 19
            new TileAdjacencyList([19, 6, 7, 21, 28, 27]),   // 20
            new TileAdjacencyList([20, 7, 8, 9, 22, 28]),    // 21
            new TileAdjacencyList([28, 21, 9, 10, 11, 23]),  // 22
            new TileAdjacencyList([29, 28, 22, 11, 12, 24]), // 23
            new TileAdjacencyList([25, 29, 23, 12, 13, 14]), // 24
            new TileAdjacencyList([16, 26, 29, 24, 14, 15]), // 25
            new TileAdjacencyList([17, 18, 27, 29, 25, 16]), // 26
            new TileAdjacencyList([18, 19, 20, 28, 29, 26]), // 27
            new TileAdjacencyList([27, 20, 21, 22, 23, 29]), // 28
            new TileAdjacencyList([26, 27, 28, 23, 24, 25])  // 29
        ],
        deserts         : [27, 29],
        portSpots       : [
            [0,  5],
            [1,  0],
            [3,  0],
            [5,  1],
            [6,  2],
            [8,  1],
            [9,  2],
            [10, 3],
            [11, 4],
            [13, 3],
            [14, 4]
        ]
    } // boardStructure
    //==================================================================================================================


//======================================================================================================================
}; // var expansionSetup
//======================================================================================================================



//======================================================================================================================
export const expansionPresetPorts = [
    Ports.MYSTERY, Ports.WOOL, Ports.MYSTERY, Ports.MYSTERY, Ports.BRICK, Ports.WOOL, Ports.LUMBER, Ports.MYSTERY,
    Ports.GRAIN, Ports.MYSTERY, Ports.ORE
];
//======================================================================================================================



//======================================================================================================================
/**
 * Populate the <code>Deck</code>s for <code>boardPieces</code> and return <code>expansionSetup</code>.
 * 
 * @returns The <code>expansionSetup</code> object.
 */
export function getExpansionSetup() {
    expansionSetup.boardPieces = {
        tileDeck: Deck.deckFromArr([
            TileType.BRICK,  TileType.BRICK,  TileType.BRICK,  TileType.BRICK,  TileType.BRICK, 
            TileType.LUMBER, TileType.LUMBER, TileType.LUMBER, TileType.LUMBER, TileType.LUMBER, TileType.LUMBER,
            TileType.WOOL,   TileType.WOOL,   TileType.WOOL,   TileType.WOOL,   TileType.WOOL,   TileType.WOOL,
            TileType.GRAIN,  TileType.GRAIN,  TileType.GRAIN,  TileType.GRAIN,  TileType.GRAIN,  TileType.GRAIN,
            TileType.ORE,    TileType.ORE,    TileType.ORE,    TileType.ORE,    TileType.ORE
        ]),
        numberDeck: Deck.deckFromArr([
            11, 11, 6, 5, 10, 10, 5, 2, 3, 8, 4, 11, 10, 8, 4, 5, 9, 3, 12, 9, 6, 12, 8, 4, 2, 5, 3, 9
        ]),
        portDeck : Deck.deckFromArr([
            Ports.MYSTERY, Ports.WOOL, Ports.MYSTERY, Ports.MYSTERY, Ports.BRICK, Ports.WOOL, Ports.LUMBER,
            Ports.MYSTERY, Ports.GRAIN, Ports.MYSTERY, Ports.ORE
        ])
    }
    return expansionSetup;
} // getExpansionSetup();
//======================================================================================================================