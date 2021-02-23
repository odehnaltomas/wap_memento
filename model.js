const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const mementoLib = require("./library");

function Bubblesort(inputArr) {
    arr = inputArr;
    this.i = 0;
    this.j = 0;
    this.getArr = function () {
        return arr;
    }

    this.nextStep = function() {
        if (this.i < arr.length - 1) {
            if (this.j < arr.length - 1) {
                var memento = new mementoLib.Memento({arr: [...arr], i : this.i, j : this.j});
                // console.log("Is",arr[this.j], " > ", arr[this.j+1]);
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

    this.prevStep = function (state) {
        arr = state.arr;
        this.i = state.i;
        this.j = state.j;
    }

    this.printCurrentStep = function() {
        var colYellow = "\x1b[33m";
        var colReset = "\x1b[0m";
        for (var i = 0; i < arr.length; i++) {
            if (i === this.j || i === this.j+1) {
                readline.output.write(colYellow + arr[i] + " " + colReset);
            } else {
                readline.output.write(arr[i] + " ");
            }
        }
        readline.output.write("\n");

        readline.output.write(arr[i] + " < " + arr[i+1] + "?")
    }
}

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

function printHelp() {
    console.log("Commands:");
    console.log("\t h - Prin this message.");
    console.log("\t e - Exit program.");
    console.log("\t n - Make and print next step.");
    console.log("\t p - Make and print previous step.");
}

function repl(bubbleSort, careTaker) {
    return new Promise(function (resolve, reject) {
        readline.setPrompt("Choice> ");
        readline.prompt();
        readline.on("line", function (line) {
            // console.log(`${line} - length: ${line.length}`);
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
                        readline.close();
                        return;
                    case "n":
                        console.log("--------Next step--------");

                        try {
                            careTaker.add(bubbleSort.nextStep());
                            // console.log(bubbleSort.getArr());
                            // printMementoList(careTaker.mementoList);
                        } catch (err) {
                            if (err === "end alg") {
                                console.log("Algorithm ended. Go to previous step or exit program.")
                            }
                        }
                        break;
                    case "p":
                        console.log("--------Previous step--------");

                        var memento = careTaker.pop();
                        if (memento === undefined) {
                            console.log("Previous step does not exist. Must make next step first.")
                        } else {
                            var state = memento.getState();
                            bubbleSort.prevStep(state);
                            // printMementoList(careTaker.mementoList);
                        }
                        break;
                    default:
                        console.log("BAD OPTION!");
                        printHelp();
                }
            }
            // console.log(careTaker.mementoList);
            bubbleSort.printCurrentStep();
            readline.prompt();
        }).on("close", function () {
            console.log("Exiting program.");
        });
    })
}

async function run() {
    var arrayStr = process.argv[2];
    var arr = arrayStr.split(",").map(x=>+x);
    var bubbleSort = new Bubblesort(arr);
    console.log("Input array: ", bubbleSort.getArr());
    var careTaker = new mementoLib.CareTaker();

    bubbleSort.printCurrentStep();

    await repl(bubbleSort, careTaker);
}

run();

