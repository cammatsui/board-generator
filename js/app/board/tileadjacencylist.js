//======================================================================================================================
/**
 * @file    tileadjacencylist.js
 * @author  cammatsui
 * @date    2021
 */
//======================================================================================================================



//======================================================================================================================
/**
 * An adjacency list for the tiles on a <code>Board</code>.
 */
export class TileAdjacencyList {
//======================================================================================================================



    //==================================================================================================================
    /**
     * Constructor for a <code>TileAdjacencyList</code>.
     * 
     * @param {*} adjacencies An array of tile ids (or -1 if no neighbor) for the directions:
     *  0: Northeast,
     *  1: East,
     *  2: Southeast,
     *  3: Southwest,
     *  4: West,
     *  5: Northwest.
     */
    constructor(adjacencies) {
        if (adjacencies.length != 6) throw "adjacencies must have length 6.";
        this.adjacencies = adjacencies;
    } // constructor ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Get the tile id of the neighgbor in the given direction.
     * 
     * @param {*} neighborDirection The direction id, as described in the <code>constructor</code>.
     * @returns The tile id.
     */
    getNeighbor(neighborDirection) {
        return this.adjacencies[neighborDirection];
    } // getNeighbor ()
    //==================================================================================================================



//======================================================================================================================
} // class TileAdjacencyList
//======================================================================================================================