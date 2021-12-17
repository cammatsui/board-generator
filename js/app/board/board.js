//======================================================================================================================
// IMPORTS
import { TileHolder } from "./tileholder.js";
import { Deck } from "../deck.js";
import { variance } from "../utils.js";
import { arrayEquals } from "../utils.js";
//======================================================================================================================



//======================================================================================================================
/**
 * @file    board.js
 * @author  cammatsui
 * @date    2021
 */
//======================================================================================================================



//======================================================================================================================
/**
 * A class representing the game board.
 */
export class Board {
//======================================================================================================================



    //==================================================================================================================
    /**
     * Constructor for a <code>Board</code>.
     * 
     * @param {*} tileAdjacencies An array of <code>TileAdjacencyList</code>s describing the <code>Board</code>'s
     * structure.
     * @param {*} deserts An array of tile ids for deserts.
     * @param {*} portSpots An array of pairs <code>(tileId, directionId)</code> for port spots.
     */
    constructor(tileAdjacencies, deserts, portSpots) {
        this.tileAdjacencies = tileAdjacencies;
        this.tileTypes = new Array(this.size() - deserts.length);
        this.tileNumbers = new Array(this.size() - deserts.length);
        this.deserts = deserts;
        this.portSpots = portSpots;
        this.ports = new Array(portSpots.length);
        if (!this.desertsAreValid()) throw 'Deserts must have valid tile ids.';
        if (!this.portSpotsAreValid()) throw 'Port pairs must be valid.';
    } // constructor ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Get the number of tiles on the <code>Board</code>.
     * 
     * @returns The number of tiles on the <code>Board</code>
     */
    size() {
        return this.tileAdjacencies.length;
    } // size ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Get a simple string representing the <code>Board</code>.
     * 
     * @returns The string.
     */
    toString() {
        var boardString = "";
        for (var i = 0; i < this.size(); i++) boardString += this.getTileString(i) + "<br>";
        boardString += "<br>";
        for (var i = 0; i < this.ports.length; i++) boardString += i + ": " + this.ports[i] + "<br>";
        return boardString;
    } // toString ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Randomly place down the tiles from <code>tileDeck</code> onto the <code>Board</code>.
     * 
     * @param {*} numberDeck A <code>Deck</code> of tiles to place.
     */
    randomTileSetup(tileDeck) {
        var holder = new TileHolder(tileDeck);
        this.resourceCounts = JSON.parse(JSON.stringify(holder.tileCounts));

        for (var i = 0; i < this.size(); i++) { 
            if (this.deserts.includes(i)) this.tileTypes[i] = TileType.Desert;
            else this.tileTypes[i] = tileDeck.popRandomChoice();
        }
    } // randomTileSetup ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Randomly place down the numbers from <code>numberDeck</code> onto the <code>Board</code>.
     * 
     * @param {*} numberDeck A <code>Deck</code> of numbers to place.
     */
    randomNumberSetup(numberDeck) {
        for (var i = 0; i < this.size(); i++) {
            if (!this.deserts.includes(i)) {
                var thisTileNumber = numberDeck.popRandomChoice();
                this.tileNumbers[i] = new TileNumber(thisTileNumber);
            }
        }
    } // randomNumberSetup ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Randomly place down the numbers from <code>numberDeck</code> onto the <code>Board</code> with no two red numbers
     * touching.
     * 
     * @param {*} numberDeck A <code>Deck</code> of numbers to place.
     */
    randomNumberSetupNoAdjacentReds(numberDeck) {
        var redNumberDeck = new Deck();
        for (var i = 0; i < numberDeck.length; i++) {
            if (numberDeck[i] == 6 || numberDeck[i] == 8)
                redNumberDeck.push(numberDeck[i]);
        }
        for (var i = 0; i < redNumberDeck.length; i++) numberDeck.remove(redNumberDeck[i]);
        // Place red numbers.
        var redNumberSpots = this.createTileIdDeck();
        var numberSpots = this.createTileIdDeck();
        for (var i = 0; i < redNumberDeck.length; i++){ 
            var thisRedNumberSpot = redNumberSpots.popRandomChoice();
            this.tileNumbers[thisRedNumberSpot] = new TileNumber(redNumberDeck[i]);
            // Remove the neighbors.
            for (var j = 0; j < 6; j++) redNumberSpots.remove(this.tileAdjacencies[thisRedNumberSpot].getNeighbor(j));
            numberSpots.remove(thisRedNumberSpot);
        }
        // Place the remaining numbers.
        for (var i = 0; i < numberSpots.length; i++) {
            this.tileNumbers[numberSpots[i]] = new TileNumber(numberDeck.popRandomChoice());
        }
    } // randomNumberSetupNoAdjacentReds ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Randomly place down the ports from <code>portDeck</code> as ports.
     * 
     * @param {*} portDeck A <code>Deck</code> of ports to place.
     */
    randomPortSetup(portDeck) {
        for (var i = 0; i < this.ports.length; i++)
            this.ports[i] = portDeck.popRandomChoice();
    } // randomPortSetup (0)
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Place down the tiles from <code>Deck</code> based on the "clumpiness" parameter <code>p</code>
     * 
     * @param {*} deck The tiles to place.
     * @param {*} p The "clumpiness" parameter.
     */
    clumpedTileSetup(deck, p) {
        var tileIds = this.createTileIdDeck();
        var holder = new TileHolder(deck);
        var tileToChooseFor = tileIds.popRandomChoice();

        this.resourceCounts = JSON.parse(JSON.stringify(holder.tileCounts));

        while (tileIds.length >= 0) {
            // If the last tile, place it.
            if (tileIds.length == 0) {
                this.tileTypes[tileToChooseFor] = holder.getTileTypes()[0];
                return;
            }
            // Choose the tile type for tileToChooseFor.
            var choseTile = false;
            if (Math.random() < p) {
                var neighborTypes = this.getNeighborTileTypes(tileToChooseFor);
                while (neighborTypes.length > 0) {
                    var candidate = neighborTypes.popRandomChoice();
                    // Check if there are any of the randomly chosen neighbor tiles left in the deck.
                    if (holder.numOfType(candidate) > 0 && !choseTile) {
                        // If so, we'll use that tile.
                        this.tileTypes[tileToChooseFor] = candidate;
                        // We'll also remove it from the deck and indicate that we've placed the tile down.
                        holder.remove(candidate);
                        choseTile = true;
                    }
                }
            }
            // If we haven't chosen a tile yet, either because we didn't get Math.random() < p or because there were no
            //  tiles of a neighbor's type left in the deck...
            if (!choseTile) {
                // Draw randomly from the remaining tiles excluding neighbors.
                var remainingTileTypes = holder.getTileTypesExcluding(this.getNeighborTileTypes(tileToChooseFor));
                if (remainingTileTypes.length == 0) remainingTileTypes = holder.getTileTypes();
                var tileToChooseForType = remainingTileTypes.randomChoice();
                // Place down the randomly chosen tile.
                this.tileTypes[tileToChooseFor] = tileToChooseForType;
                // Remove this tile from the deck.
                holder.remove(tileToChooseForType)
            }
            // Choose the next tile to look for.
            //  Look at possible next neighbors (those without tile type already chosen).
            var emptyNeighbors = this.getEmptyNeighbors(tileToChooseFor);
            //  If there are none, choose a random remaining empty tile.
            if (emptyNeighbors.length == 0) tileToChooseFor = tileIds.randomChoice();
            //  Otherwise choose a random neighbor.
            else tileToChooseFor = emptyNeighbors.getRandomChoice();
            tileIds.removeAt(tileIds.indexOf(tileToChooseFor));
        }
    } // clumpedTileSetup ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Fill all of the settlement spots.
     */
    initializeSettlementSpots() {
        this.settlementSpots = [];
        for (var id = 0; id < this.size(); id++) {
            var thisSpotNeighbors = this.collectTileSpots(id);
            for (var i = 0; i < thisSpotNeighbors.length; i++) {
                var seenThisSpot = false;
                for (var j = 0; j < this.settlementSpots.length; j++) {
                    if (arrayEquals(thisSpotNeighbors[i], this.settlementSpots[j])) {
                        seenThisSpot = true;
                        break;
                    }
                }
                // Check that not edge spot.
                var numNegativeOnes = 0;
                for (var k = 0; k < 3; k++)
                    if (thisSpotNeighbors[i][k] == -1) numNegativeOnes++;
                if (numNegativeOnes == 2) seenThisSpot = false;
                // If we haven't seen this spot before, add it.
                if (!seenThisSpot) this.settlementSpots.push(thisSpotNeighbors[i]);
            }
        }
    } // initializeSettlementSpots ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Calculate and update the variance in average resource abundance for each resource type.
     */
    calculateResourceVariance() {
        // Calculate average probabilities.
        var probs = this.calculateResourceBalance();
        var tileProbs = []
        for (var tileType in this.resourceCounts) {
            probs[tileType] /= this.resourceCounts[tileType];
            tileProbs.push(probs[tileType]);
        }
        this.ResourceVariance = variance(tileProbs);
    } // calculateResourceVariance ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Calculate and update the variance in expected resources across settlement spots.
     */
    calculateSettlementResourceVariance() {
        this.SettlementResourceVariance = variance(this.calculateSettlementResources());
    } // calculateSettlementResourceVariance ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Get a description (number and resource) of the occupancy of each tile id.
     * 
     * @returns The description of tile id occupancies.
     */
    getTileOccupancies() {
        var tileOccupancies = [];
        for (var i = 0; i < this.size(); i++) {
            var thisTileOccupancy = {}
            if (this.deserts.includes(i)) {
                thisTileOccupancy.resource = "Desert";
            } else {
                thisTileOccupancy.resource = this.tileTypes[i];
                thisTileOccupancy.number = this.tileNumbers[i].number;
            }
            tileOccupancies.push(thisTileOccupancy);
        }
        return tileOccupancies;
    } // getTileOccupancies ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Get the <code>tileSpot</code>s on the tile with id <code>id</code>.
     * 
     * @param {*} id The tile id of interest.
     */
    collectTileSpots(id) {
        var tileSpots = [[id, this.tileAdjacencies[id].getNeighbor(5), this.tileAdjacencies[id].getNeighbor(0)]];
        for (var i = 0; i < 5; i++)
            tileSpots.push([id, this.tileAdjacencies[id].getNeighbor(i), this.tileAdjacencies[id].getNeighbor(i+1)]);
        return tileSpots;
    } // collectTileSpots (0)
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Create a table of the total relative roll probabilities for each resource.
     * 
     * @returns The described table.
     */
    calculateResourceBalance() {
        var probs = {}
        for (var tileType in this.resourceCounts) probs[tileType] = 0;
        // Count the total probabilities.
        for (var i = 0; i < this.size(); i++) {
            if (!this.deserts.includes(i)) {
                var tileType = this.tileTypes[i];
                probs[tileType] += RollProbability[this.tileNumbers[i].number];
            }
        }
        return probs;
    } // calculateResourceBalance ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Get data for expected resources per turn per resource tile neighbor for all the settlement spots.
     */
    calculateSettlementResources() {
        var settlementResources = [];
        for (var i = 0; i < this.settlementSpots.length; i++) {
            var thisSpotExpectedResources = 0;
            var thisSpot = this.settlementSpots[i];
            var numNeighbors = 0;
            for (var j = 0; j < 3; j++) {
                if (!this.deserts.includes(thisSpot[j]) && thisSpot[j] != -1) {
                    numNeighbors += 1;
                    var neighborId = this.tileNumbers[thisSpot[j]].number;
                    var neighborExpectedResources = RollProbability[neighborId];
                    thisSpotExpectedResources += neighborExpectedResources;
                }
            }
            if (![0,1].includes(numNeighbors))
                settlementResources.push(thisSpotExpectedResources / numNeighbors);
        }
        return settlementResources;
    } // calculateSettlementResources ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Get an array of tile ids that are neighbors of the tile with id <code>id</code> and empty.
     * 
     * @param {*} id The tile id of interest.
     * @returns An array of empty neighboring tile ids.
     */
    getEmptyNeighbors(id) {
        var emptyNeighbors = new Deck();
        var nIds = this.tileAdjacencies[id]
        for (var i = 0; i < 6; i++) {
            var nId = nIds.getNeighbor(i);
            if (nId != -1 && this.tileTypes[nId] == null && !this.deserts.includes(nId)) emptyNeighbors.shift(nId);
        }
        return emptyNeighbors;
    } // getEmptyNeighbors ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Get an array of the tile types neighboring the tile with id <code>id</code>.
     * 
     * @param {*} id The tile id of interest.
     * @returns An array of neighboring tile types.
     */
    getNeighborTileTypes(id) {
        var thisTileNeighbors = this.tileAdjacencies[id];
        var nTileTypes = new Deck();
        for (var i = 0; i < 6; i++) {
            var nId = thisTileNeighbors.getNeighbor(i);
            if (nId == -1 || this.deserts.includes(nId)) continue;
            var thisNeighborType = this.tileTypes[nId];
            if (thisNeighborType != null) {
                nTileTypes.push(thisNeighborType);
            }
        }
        return nTileTypes;
    } // getNeighhborTileTypes ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Create a <code>Deck</code> of tile ids, excluding desert ids.
     * 
     * @returns The described <code>Deck</code>.
     */
    createTileIdDeck() {
        var tileIds = new Deck();
        for (var i = 0; i < this.size(); i++) if (!this.deserts.includes(i)) tileIds.push(i);
        return tileIds;
    } // createTileIdDeck ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Check whether the desert ids are valid, i.e., are in between 0 and <code>size()</code..
     * 
     * @returns A boolean indicating whether the desert ids are valid.
     */
    desertsAreValid() {
        for (var i = 0; i < this.deserts.length; i++)
            if (this.deserts[i] < 0 || this.deserts[i] >= this.size()) return false;
        return true;
    } // desertsAreValid ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Check whether the <code>portSpots</code> are valid, i.e., aren't where other tiles are.
     * 
     * @returns A boolean indicating whether the port spots are valid.
     */
    portSpotsAreValid() {
        for (var i = 0; i < this.portSpots.length; i++) {
            var portTile = this.portSpots[i][0];
            var portDirection = this.portSpots[i][1];
            if (this.tileAdjacencies[portTile].getNeighbor(portDirection) != -1)
                return false;
        }
        return true;
    } // portSpotsAreValid ()
    //==================================================================================================================
    
    
    
    //==================================================================================================================
    /**
     * Get a string representing a tile with id <code>i</code> indicating its resource type and roll number.
     * 
     * @param {*} i The tile id.
     * @returns The string.
     */
    getTileString(i) {
        var tileString = i + ": ";
        if (this.deserts.includes(i)) return tileString + "Desert";
        return tileString + this.tileTypes[i] + ", " + this.tileNumbers[i].number;
    } // getTileString ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Get a one letter abbreviation of the tile with id <code>i</code>'s resource type.
     * 
     * @param {*} i The tile id.
     * @returns The abbreviation.
     */
    tileAbb(i) {
        if (this.deserts.includes(i)) return "D";
        return this.tileTypes[i][0];
    } // this.tileAbb ()
    //==================================================================================================================



//======================================================================================================================
} // class Board
//======================================================================================================================



//======================================================================================================================
/**
 * A class wrapping a number on a tile.
 */
export class TileNumber {
//======================================================================================================================



    //==================================================================================================================
    /**
     * Constructor for a <code>TileNumber</code>.
     * 
     * @param {*} number The number to wrap.
     */
    constructor(number) {
        if (number < 2 || number > 12) throw 'number must be between 2 and 12, inclusive';
        this.number = number;
    } // constructor
    //==================================================================================================================



//======================================================================================================================
} // class TileNumber
//======================================================================================================================



//======================================================================================================================
/**
 * An enum of the types of resource tiles.
 */
export const TileType = {
    BRICK: "Brick",
    LUMBER: "Lumber",
    WOOL: "Wool",
    GRAIN: "Grain",
    ORE: "Ore"
} // const TileTypes
//======================================================================================================================



//======================================================================================================================
/**
 * A table of relative roll probabilities for each number.
 */
export const RollProbability = {
    2  : 1,
    3  : 2,
    4  : 3,
    5  : 4,
    6  : 5,
    8  : 5,
    9  : 4,
    10 : 3,
    11 : 2,
    12 : 1
}; // const RollProbability
//======================================================================================================================



//======================================================================================================================
/**
 * An enum of the types of ports.
 */
export const Ports = {
    BRICK   : "Brick",
    LUMBER  : "Lumber",
    WOOL    : "Wool",
    GRAIN   : "Grain",
    ORE     : "Ore",
    MYSTERY : "Mystery"
}; // const Ports
//======================================================================================================================
