//======================================================================================================================
// IMPORTS
import { randomInt } from "./utils.js";
//======================================================================================================================



//======================================================================================================================
/**
 * @file    deck.js
 * @author  cammatsui
 * @date    2021
 */
//======================================================================================================================



//======================================================================================================================
/**
 * A <code>Deck</code> extends an <code>Array</code> and includes functions for randomly choosing and popping.
 */
export class Deck extends Array {
//======================================================================================================================



    //==================================================================================================================
    /**
     * Add all of the elements of <code>arr</code> to the <code>Deck</code>.
     * 
     * @param {*} arr The array of elements to add to the <code>Deck</code>.
     */
    addAll(arr) {
        for (var i = 0; i < arr.length; i++) this.push(arr[i]);
    } // addAll ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Remove the given element from the <code>Deck</code>.
     * 
     * @param {*} element The element to remove.
     * @returns A <code>boolean</code> indicating whether or not the removal was successful, i.e., 
     * whether <code>element</code> was present in the <code>Deck</code>.
     */
    remove(element) {
        var index = this.indexOf(element);
        if (index >= 0) {
            this.removeAt(index);
            return true;
        }
        return false;
    } // remove ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Remove the element at the given index from the <code>Deck</code>.
     * 
     * @param {*} index The index to remove the element from.
     * @returns The element at the index <code>index</code>.
     */
    removeAt(index) {
        if (index < 0 || index >= this.length) throw 'index out of bounds';
        var toReturn = this[index];
        this.splice(index, 1);
        return toReturn;
    } // removeAt ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Remove and return a random element from the <code>Deck</code>.
     * 
     * @returns The randomly chosen element.
     */
    popRandomChoice() {
        return this.removeAt(randomInt(this.length));
    } // popRandomChoice ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Return a random element from the <code>Deck</code>.
     * 
     * @returns The randomly chosen element.
     */
    randomChoice() {
        return this[randomInt(this.length)];
    } // randomChoice ()
    //==================================================================================================================



    //==================================================================================================================
    /**
     * Make a <code>Deck</code> from the array <code>arr</code>
     * 
     * @param {*} arr The array to make a <code>Deck</code> from.
     * @returns The created <code>Deck</code>.
     */
    static deckFromArr(arr) {
        var d = new Deck();
        for (var i = 0; i < arr.length; i++) d.push(arr[i]);
        return d;
    } // deckFromArr ()
    //==================================================================================================================



//======================================================================================================================
} // class Deck
//======================================================================================================================