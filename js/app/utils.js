//======================================================================================================================
// IMPORTS
import { Deck } from "./deck.js";
//======================================================================================================================



//======================================================================================================================
/**
 * @file    utils.js 
 * @author  cammatsui
 * @date    2021
 */
//======================================================================================================================



//======================================================================================================================
/**
 * Calculate the variance of the array <code>dataArray</code>.
 * 
 * @param {*} dataArray The array to calculate the variance of.
 * @return The variance of the array.
 */
export function variance(dataArray) {
    var x_bar = mean(dataArray);
    var n = dataArray.length;
    var numerator = 0;
    for (var i = 0; i < dataArray.length; i++) {
        var x_i = dataArray[i];
        var dev = x_i - x_bar;
        numerator += (dev * dev);
    }
    return numerator / (n-1);
} // sd ()
//======================================================================================================================



//======================================================================================================================
/**
 * Calculate the mean of the array <code>dataArray</code>.
 * 
 * @param {*} dataArray The array to calculate the mean of.
 * @returns The mean of the array.
 */
export function mean(dataArray) {
    var n = dataArray.length;
    var sum = 0;
    for (var i = 0; i < n; i++) sum += dataArray[i];
    return sum / n;
} // mean ()
//======================================================================================================================



//======================================================================================================================
/**
 * Check whether two arrays <code>a</code> and <code>b</code> are equal, meaning they contain the same elements.
 * 
 * @param {*} a The first array.
 * @param {*} b The second array.
 * @returns A boolean representing whether the arrays are equal.
 */
export function arrayEquals(a, b) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++)
        if (!b.includes(a[i])) return false;
    return true;
} // arrayEquals ()
//======================================================================================================================



//======================================================================================================================
/**
 * Get a random integer between 0 (inclusive) and <code>bound</code> (exclusive).
 * 
 * @param {*} bound The exclusive upper bound.
 * @returns The random integer.
 */
export function randomInt(bound) {
    return Math.floor(Math.random() * bound);
} // randomInt ()
//======================================================================================================================



//======================================================================================================================
/**
 * Convert polar coordinates to Cartesian.
 * 
 * @param {*} r The radius of the polar coordinate.
 * @param {*} theta The angle of the polar coordinate.
 * @returns An object representing the Cartesian coordinates.
 */
export function polarToCartesian(r, theta) {
    return {
        x: r*Math.cos(theta),
        y: r*Math.sin(theta)
    }
} // polarToCartesian ()
//======================================================================================================================



//======================================================================================================================
/**
 * Get the angle (in radians) corresponding to a tile direction.
 * 
 * @param {*} direction An integer representing the tile direction.
 * @returns The angle in radians.
 */
export function tileDirectionToAngle(direction) {
    return (-Math.PI/3) + (direction * (Math.PI/3));
} // tileDirectionToAngle ()
//======================================================================================================================



//======================================================================================================================
/**
 * Get <code>numNumbers</code> random integers between 0 (inclusive) and <code>max</code> (exclusive).
 * 
 * @param {*} max The (exclusive) upper bound on the random integers.
 * @param {*} numNumbers THe number of random integers to generate.
 * @returns An array of the generated integers.
 */
export function getRandomNumbers(max, numNumbers) {
    var nums = new Deck();
    for (var i = 0; i < max; i++) nums.push(i);
    var rands = [];
    for (var j = 0; j < numNumbers; j++) rands.push(nums.popRandomChoice());
    return rands;
} // getRandomNumbers
//======================================================================================================================