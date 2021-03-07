import {Memento, CareTaker} from './library.mjs'
import readline from 'readline'

"use strict";

const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    err: process.stderr
});

function Bubblesort(inputArr) {
    let arr = inputArr;
    this.i = 0;
    this.j = 0;
    this.getArr = function () {
        return arr;
    }

    this.nextStep = function() {
        if (this.i < arr.length - 1) {
            if (this.j < arr.length - 1) {
                let memento = new Memento();
                memento.setState({arr: [...arr], i : this.i, j : this.j});

                if (arr[this.j] > arr[this.j+1]) {
                    var tmp = arr[this.j];
                    arr[this.j] = arr[this.j+1];
                    arr[this.j+1] = tmp;
                }

                this.j++;
                if ((this.j % (arr.length-1)) === 0) {
                    this.j = 0;
                    this.i++;
                }
                return memento;
            }
        }
        throw "end alg";
    }

    /**
     * Return to previous step
     * @param state State of previous step (step we want restore).
     */
    this.prevStep = function (state) {
        arr = state.arr;
        this.i = state.i;
        this.j = state.j;
    }

    /**
     * 1. Print number sequence to order (with highlighted numbers of current step).
     * 2. Compare two numbers of current step.
     * 3. Print number sequence with result of comparison.
     */
    this.printCurrentStep = function() {
        var colYellow = "\x1b[33m";
        var colReset = "\x1b[0m";
        /** First step **/
        for (let i = 0; i < arr.length; i++) {
            if (i === this.j || i === this.j+1) {
                readLine.output.write(colYellow + arr[i] + " " + colReset);
            } else {
                readLine.output.write(arr[i] + " ");
            }
        }
        readLine.output.write("\n");

        /** Second step **/
        readLine.output.write(arr[this.j] + " > " + arr[this.j+1] + "?\n")

        if (arr[this.j] > arr[this.j+1]) {
            readLine.output.write("YES => SWAP\n");
        } else {
            readLine.output.write("NO => Do nothing\n");
        }

        /** Third step **/
        for (let i = 0; i < arr.length; i++) {
            if (i === this.j) {
                readLine.output.write(colYellow + arr[i+1] + " " + arr[i] + " " + colReset);
                continue;
            } else if (i === (this.j+1)) {
                continue;
            }

            readLine.output.write(arr[i] + " ");
        }
        readLine.output.write("\n");
    }
}

/**
 * Helper function to print list of mementos.
 * @param memList List of mementos.
 */
function printMementoList(memList) {
    console.log("MEMENTO LIST:");
    console.log("[");
    for(var i = 0; i < memList.length; i++) {
        console.log("  {");
        console.log("     arr:", memList[i].state.arr);
        console.log("     i:", memList[i].state.i);
        console.log("     j:", memList[i].state.j);
        console.log("  },");
    }
    console.log("]")
}

/**
 * Function to print help message with commands.
 */
function printHelp() {
    console.log("Commands:");
    console.log("\t h - Print this message.");
    console.log("\t e - Exit program.");
    console.log("\t n - Make and print next step.");
    console.log("\t p - Make and print previous step.");
}

function repl(bubbleSort, careTaker) {
    return new Promise(function (resolve, reject) {
        readLine.setPrompt("Choice> ");
        readLine.prompt();
        readLine.on("line", function (line) {
            if (line.length !== 1) {
                console.log("BAD OPTION!");
                printHelp();
            }
            else {
                switch (line) {
                    case "h":
                        printHelp();
                        break;
                    case "e":
                        readLine.close();
                        return;
                    case "n":
                        console.log("--------Next step--------");

                        try {
                            careTaker.add(bubbleSort.nextStep());
                        } catch (err) {
                            if (err === "end alg") {
                                console.log("Algorithm ended. Go to previous step or exit program.")
                            }
                        }
                        bubbleSort.printCurrentStep();
                        break;
                    case "p":
                        console.log("--------Previous step--------");

                        var memento = careTaker.pop();
                        if (memento === undefined) {
                            console.log("Previous step does not exist. Must make next step first.")
                        } else {
                            var state = memento.getState();
                            bubbleSort.prevStep(state);
                        }
                        bubbleSort.printCurrentStep();
                        break;
                    default:
                        console.log("BAD OPTION!");
                        printHelp();
                }
            }
            readLine.prompt();
        }).on("close", function () {
            console.log("Exiting program.");
        });
    })
}

/**
 * Main function of model.
 * @returns {Promise<void>}
 */
async function run() {
    if (process.argv.length !== 3) {
        console.error("Error: Bad number of input arguments!");
        process.exit(1);
    }
    var arrayStr = process.argv[2];
    var arr = arrayStr.split(",").map(x=>+x);
    var bubbleSort = new Bubblesort(arr);
    console.log("Input array: ", bubbleSort.getArr());
    var careTaker = new CareTaker();

    bubbleSort.printCurrentStep();

    await repl(bubbleSort, careTaker);
}

run();

