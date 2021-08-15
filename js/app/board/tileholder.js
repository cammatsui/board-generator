//======================================================================================================================
// IMPORTS
import { Deck } from "../deck.js";
//======================================================================================================================



//======================================================================================================================
/**
 * @file    tileholder.js
 * @author  cammatsui
 * @date    2021
 */
//======================================================================================================================



//======================================================================================================================
/**
 * A data structure that wraps both a <code>Deck</code> and a table to hold tiles for placement.
 */
export class TileHolder {
//======================================================================================================================



    //==================================================================================================================
    /**
     * Constructor for a <code>TileHolder</code>.
     * 
     * @param {*} tileDeck The <code>Deck</code> of tiles to wrap.
     */
    constructor(tileDeck) {
        this.tileDeck = tileDeck;
        this.tileCounts = {};
        this.setupTileCounts();
    } // constructor ()
    //================================================================================================================== 



    //================================================================================================================== 
    /**
     * Get the number of tiles of a given type that are in the <code>TileHolder</code>.
     * 
     * @param {*} t The type of interest.
     * @returns The number of tiles of type <code>t</code>.
     */
    numOfType(t) {
        return this.tileCounts[t];
    } // numOfType ()
    //================================================================================================================== 



    //================================================================================================================== 
    /**
     * Get the tiles in the <code>TileHolder</code>, excluding any of any type that appear in <code>excludeTiles</code>.
     * 
     * @param {*} excludeTiles The tile types to exclude.
     * @returns The <code>Deck</code> of tiles as described.
     */
    getTileTypesExcluding(excludeTiles) {
        var remainingTileTypes = new Deck();
        for (var tileType in this.tileCounts) {
            if (!excludeTiles.includes(tileType)) {
                for (var i = 0; i < this.numOfType(tileType); i++) remainingTileTypes.push(tileType);
            }
        }
        return remainingTileTypes;
    } // getTileTypesExcluding ()
    //================================================================================================================== 



    //================================================================================================================== 
    /**
     * Get all of the tiles in the <code>TileHolder</code>.
     * 
     * @returns A <code>Deck</code> containing all of the tiles in the <code>TileHolder</code>.
     */
    getTileTypes() {
        return this.getTileTypesExcluding(new Deck());
    } // getTileTypes ()
    //================================================================================================================== 



    //================================================================================================================== 
    /**
     * Remove a tile of type <code>t</code> from the <code>TileHolder</code>.
     * 
     * @param {*} t The type of tile to remove.
     * @returns A boolean indicating whether or not the removal was successful, i.e., whether there was a tile of type
     * <code>t</code> in the <code>TileHolder</code> before removal.
     */
    remove(t) {
        if (!this.tileCounts.hasOwnProperty(t) || this.tileCounts[t] == 0) return false;
        this.tileCounts[t] -= 1;
        return this.tileDeck.remove(t);
    } // remove ()
    //================================================================================================================== 



    //================================================================================================================== 
    /**
     * Initialize the <code>tileCounts</code> table.
     */
    setupTileCounts() {
        for (var i = 0; i < this.tileDeck.length; i++) {
            var tile = this.tileDeck[i];
            if (!this.tileCounts.hasOwnProperty(tile))
                this.tileCounts[tile] = 0;
            this.tileCounts[tile]++;
        }
    } // setupTileCounts ()
    //================================================================================================================== 



//======================================================================================================================
} // class TileHolder
//======================================================================================================================