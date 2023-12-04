const { readFile, toStringAndSplitBy } = require("../../utils");
const { resolve } = require("path");

function parseGameInfo(line) {
    const [gameAndID, gameResults] = line.split(":");
    const [_, gameID] = gameAndID.match(/Game (\d+)/);

    const sets = gameResults.replace(/,/g, "").split(";");

    const resultsMap = {};

    for (const set of sets) {
        const results = set.trim().split(" ");

        for (let i = 0; i < results.length; i += 2) {
            const color = results[i + 1].trim();
            resultsMap[color] = Math.max((resultsMap[color] || 0 ), parseInt(results[i].trim()));
        }
    }

    return {
        results: resultsMap,
        gameID: parseInt(gameID),
    }
}

function isPossibleSet(bag, results) {
    for (const [key, value] of Object.entries(bag)) {
        if (results[key] > value) {
            return false;
        }

        delete results[key];
    }

    return Object.keys(results) == 0;
}

function computePowerOfSet(results) {
    let result = 1;

    for (const [_key, count] of Object.entries(results)) {
        result *= count;
    }

    return result;
}

/**
 * 
 */
async function compute(path = resolve("./src/day_2/input.txt"), partOne = false) {
    const bagContains = {
        red: 12,
        green: 13,
        blue: 14
    };

    let result = 0;
    try {

        const transformers = [toStringAndSplitBy];

        const input = await readFile(path, transformers);

        for (const line of input) {
            const { results, gameID } = parseGameInfo(line);

            if (partOne) {
                if (!isPossibleSet(bagContains, results)) {
                    continue;
                }
                result += gameID;
            } else {
                result += computePowerOfSet(results);
            }
        }

    } catch (ex) {
        console.error("Error occurred: ", ex);
    }

    return result;
}

module.exports = compute;