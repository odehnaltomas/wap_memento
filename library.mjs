'use strict'

/**
 * Used to store Originator state.
 */
var Memento =  function() {
    let state;

    this.setState = function(st) {
        this.state = st;
    }

    this.getState = function() {
        return this.state;
    }
};

/**
 * Used to save Memento objects into array (implemented as Stack).
 */
var CareTaker =  function() {
    this.mementoList = [];

    this.add = function(memento) {
        this.mementoList[this.mementoList.length] = memento;
    }

    this.pop = function() {
        var memento = this.mementoList[this.mementoList.length - 1];
        this.mementoList.splice(this.mementoList.length-1, 1);
        return memento;
    }
};

export {Memento, CareTaker};