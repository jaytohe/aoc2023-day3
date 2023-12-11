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
 * Find the sum of the part numbers which are adjacent to a symbol.
 * 
 * A symbol is defined as any non-alphanumeric, dot or newline character.
 * 
 * The algorithm assumes that one part number cannot be adjacent to two symbols.
 * Each part numbers is described by an object {number: <part number>, found: <boolean>}
 * with the found attribute being true once that part number is found to be
 * adjacent to a symbol to prevent duplication.
 * 
 * @param {*} puzzleString 
 */
function findDigitsAndSymbols(puzzleString) {

    const partNumberRegex = /(\d+)/g;
    const symbolRegex = /([^A-Za-z0-9.\n])/g;
    const newLineRegex = /\n/;

    const partNumberMatches = puzzleString.matchAll(partNumberRegex);
    const symbolMatches = puzzleString.matchAll(symbolRegex);

    // find line length by finding the index of the first newline char in the string.
    const firstNewLineMatch = puzzleString.match(newLineRegex);
    const lineLength = firstNewLineMatch.index+1; //linelength is index of last character + 1

    // Save pairs of index, part number.
    // If a part number has more than one digit,
    // the index of each digit is mapped to the whole part number.
    const allPartNumbersByIndex = new Map();

    for (const partNumberMatch of partNumberMatches) {
        //save it's partnumber as an object containing the number and a `found` indicator.
        const partNumber = {number : Number(partNumberMatch[1]), found: false};
        for (let i=partNumberMatch.index; i<partNumberMatch.index + partNumberMatch[1].length; i++) {
            // pass in the object reference to every index position corresponding to that part number.
            allPartNumbersByIndex.set(i, partNumber);
        }
    }
    const symbolizedPartNumbers = new Map();

    for (const symbolMatch of symbolMatches) {

        // a
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
            //If there exists a part at that position, add it to symbolizedPartNumbers
            // only if that position has not already been added
            // and that number has not already been found.
            let partNumber;
            if (allPartNumbersByIndex.has(position) 
            && !symbolizedPartNumbers.has(position)
            && !((partNumber = allPartNumbersByIndex.get(position))).found
            ) {
                symbolizedPartNumbers.set(position, allPartNumbersByIndex.get(position).number);
                allPartNumbersByIndex.get(position).found = true;
            }
        }
    }

    //DEBUG
    //console.log(Array.from(puzzleString.matchAll(partNumberRegex)));
    //console.log(Array.from(puzzleString.matchAll(symbolRegex)));
    //console.log(`Line Length is ${lineLength}`);
    console.log(Array.from(symbolizedPartNumbers.values()));

    const partNumbersSum = Array.from(symbolizedPartNumbers.values()).reduce((acc, val) => acc + val, 0);
    console.log(`The part numbers sum is ${partNumbersSum}`);
}

readPuzzleInputFile("input.txt");