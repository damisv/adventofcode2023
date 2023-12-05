const { readFile, toStringAndSplitBy } = require("../../utils");
const { resolve } = require("path");

function getWinningNumbersAndCount(line) {
    const [gameAndID, gameResults] = line.split(":");
    const [_, gameID] = gameAndID.match(/Card\s+(\d+)/);

    const [winningNumbersString, myNumbersString] = gameResults.split("|");
    const winningNumbers = winningNumbersString.trim().split(/\s+/);
    const myNumbers = myNumbersString.trim().split(/\s+/);

    const winningNumbersSet = new Set();
    winningNumbers.forEach((number) => winningNumbersSet.add(number));

    const results = {};

    for (const num of myNumbers) {
        if (!winningNumbersSet.has(num)) continue;
        results[num] = (results[num] || 0) + 1;
    }

    return { results, gameID: parseInt(gameID) };
}

function computePoints(results) {
    let points = 0;

    for (const [key, value] of Object.entries(results)) {
        if (points < 1) {
            points = 1;
            continue;
        }
        points *= 2;
    }

    return points;
}

/**
 * 
 */
async function compute(path = resolve("./src/day_4/input.txt"), partOne = false) {
    let result = 0;

    try {

        const transformers = [
            toStringAndSplitBy,
        ];

        const input = await readFile(path, transformers);

        const gameMapCount = new Array(input.length + 1).fill(0);

        for (const line of input) {
            const { results, gameID } = getWinningNumbersAndCount(line);

            gameMapCount[gameID]++;

            if (partOne) {
                result += computePoints(results);
            } else {
                const matches = Object.keys(results).length;

                for (let j = 1; j < matches + 1; j++) {
                    if (gameID + j < gameMapCount.length) {
                        gameMapCount[gameID + j] += gameMapCount[gameID];
                    }
                }
                result += gameMapCount[gameID];
            }
        }

    } catch (ex) {
        console.error("Error occurred: ", ex);
    }

    return result;
}

module.exports = compute;