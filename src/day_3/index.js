const { readFile, toStringAndSplitBy } = require("../../utils");
const { resolve } = require("path");

function computePartNumbers(engineSchematic) {
    const rows = engineSchematic.length;
    const columns = engineSchematic[0].length;

    let result = 0;

    for (let i = 0; i < rows; i++) {
        const numbers = engineSchematic[i].join("").matchAll(/(\d+)/g);

        for (const num of [...numbers]) {
            let symbolAdjacent = false;
            const startIdx = num.index;
            const endIdx = num.index + num[0].length - 1;
            
            {
                // Check same row
                if (startIdx > 0) {
                    symbolAdjacent = symbolAdjacent || engineSchematic[i][startIdx - 1] != '.';
                }

                if (endIdx < columns - 1) {
                    symbolAdjacent = symbolAdjacent || engineSchematic[i][endIdx + 1] != '.';
                }
            }

            {
                for (let j = (startIdx > 0 ? startIdx - 1 : 0); j < (endIdx + 2 < columns ? endIdx + 2 : endIdx); j++) {
                    if (symbolAdjacent) break;
                    
                    if (i > 0) {
                        // Check above row
                        symbolAdjacent = symbolAdjacent || engineSchematic[i - 1][j] != ".";
                    }

                    if (i < rows - 1) {
                        // Check below row
                        symbolAdjacent = symbolAdjacent || engineSchematic[i + 1][j] != ".";
                    }
                    
                }
            }

            if (symbolAdjacent) {
                result += parseInt(num[0]);
            }
        }
    }

    return result;
}

function computeGearRatio(engineSchematic) {
    const rows = engineSchematic.length;

    let result = 0;

    for (let i = 0; i < rows; i++) {
        const gears = engineSchematic[i].join("").matchAll(/([*])/g);

        // Same row
        const sameRowNumbers = [...engineSchematic[i].join("").matchAll(/(\d+)/g)];

        // Next row
        const nextRowNumbers = i < rows - 1 ? [...engineSchematic[i + 1].join("").matchAll(/(\d+)/g)] : [];

        const prevRowNumbers = i > 0 ? [...engineSchematic[i - 1].join("").matchAll(/(\d+)/g)] : [];

        for (const gear of [...gears]) {
            const adjacentNumbers = [];

            // Check for numbers that are adjacent to the *
            for (const num of [...sameRowNumbers, ...nextRowNumbers, ...prevRowNumbers]) {
                const numStartIdx = num.index;
                const numEndIdx = num.index + num[0].length - 1;
                if (numStartIdx - 1 <= gear.index && numEndIdx + 1 >= gear.index) {
                    adjacentNumbers.push(num[0]);
                }
            }

            if (adjacentNumbers.length == 2) {
                result += adjacentNumbers[0] * adjacentNumbers[1];
            }
        }
    }

    return result;
}

/**
 * 
 */
async function compute(path = resolve("./src/day_3/input.txt"), partOne = false) {
    let result = 0;

    try {

        const transformers = [
            toStringAndSplitBy,
            (arrInput) => arrInput.map(line => toStringAndSplitBy(line, "")),
        ];

        const input = await readFile(path, transformers);

        if (partOne) {
            result += computePartNumbers(input);
        } else {
            result += computeGearRatio(input);
        }

    } catch (ex) {
        console.error("Error occurred: ", ex);
    }

    return result;
}

module.exports = compute;