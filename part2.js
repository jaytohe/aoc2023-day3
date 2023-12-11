const fs = require('fs');
const readline = require('readline');


/**
 * Read the whole puzzle input to a string called puzzleString
 * and call findDigitsAndSymbols on it.
*/
async function readPuzzleInputFile(filename) {
    return await fs.readFile(filename, "utf8", (err, puzzleString) => {
        if (err) {
            console.log(err);
            return;
        }
        findDigitsAndSymbols(puzzleString);
    })
}

/**
 * 
 * Find the sum of the gear ratios in the puzzle string.
 * 
 * A gear is defined as any asterisk symbol that is adjacent to exactly two part numbers.
 * Multiple gears can share the same part number(s) so here we don't care whether 
 * a part number has already been found or not.
 * @param {*} puzzleString 
 */
function findDigitsAndSymbols(puzzleString) {

    const partNumberRegex = /(\d+)/g;
    const symbolRegex = /(\*)/g;
    const newLineRegex = /\n/;

    const partNumberMatches = puzzleString.matchAll(partNumberRegex);
    const symbolMatches = puzzleString.matchAll(symbolRegex);

    // find line length by finding the index of the first newline char in the string.
    const firstNewLineMatch = puzzleString.match(newLineRegex);
    const lineLength = firstNewLineMatch.index+1; //linelength is index of last character + 1

    // HashMap<Index, IntegerMatch>
    const allPartNumbersByIndex = new Map();

    for (const partNumberMatch of partNumberMatches) {
        for (let i=partNumberMatch.index; i<partNumberMatch.index + partNumberMatch[1].length; i++) {
            // pass in the object reference to every index position corresponding to that part number.
            allPartNumbersByIndex.set(i, Number(partNumberMatch[1]));
        }
    }

    let gearRatiosSum = 0;
    for (const symbolMatch of symbolMatches) {

        const partNumbersFound = new Set();
        const possiblePartPositions = [
            symbolMatch.index-1, //before symbol
            symbolMatch.index+1, //after symbol
            symbolMatch.index-lineLength, //above symbol
            symbolMatch.index-lineLength-1, // left diagonal above
            symbolMatch.index-lineLength+1, // right diagonal above
            symbolMatch.index+lineLength, // below symbol
            symbolMatch.index+lineLength-1, // left diagonal below
            symbolMatch.index+lineLength+1, // right diagonal below
        ];
        for (const position of possiblePartPositions) {
            //If there exists a part at that position, add it to partNumbersFound
            if (allPartNumbersByIndex.has(position) 
            && !partNumbersFound.has((partNumber = allPartNumbersByIndex.get(position)))
            ) {
                partNumbersFound.add(partNumber);
            }
        }

        //console.log(partNumbersFound);

        if (partNumbersFound.size == 2) { // A gear has exactly two part numbers.
            const gearRatio = Array.from(partNumbersFound.values()).reduce((acc, val) => acc * val, 1);
            //console.log(gearRatio);
            gearRatiosSum += gearRatio;
        }
    }

    //DEBUG
    //console.log(Array.from(puzzleString.matchAll(partNumberRegex)));
    //console.log(Array.from(puzzleString.matchAll(symbolRegex)));
    //console.log(`Line Length is ${lineLength}`);
    console.log(`The gear ratios sum is ${gearRatiosSum}`);
}

readPuzzleInputFile("input.txt");