const { readFile, toStringAndSplitBy } = require("../../utils");
const { resolve } = require("path");

/**
 * 
 */
async function compute(path = resolve("./src/day_6/input.txt"), partOne = false) {
    let result = 1;

    try {

        const transformers = [
           toStringAndSplitBy,
        ];

        const input = await readFile(path, transformers);

        let times = input[0].split("Time:")[1].trim().split(/\s+/).map((number) => parseInt(number));
        let distances = input[1].split("Distance:")[1].trim().split(/\s+/).map((number) => parseInt(number));

        if (!partOne) {
            times = [parseInt(input[0].split("Time:")[1].trim().replace(/\s+/g, ""))];
            distances = [parseInt(input[1].split("Distance:")[1].trim().replace(/\s+/g, ""))];
        }

        for (let i = 0; i < times.length; i++) {
            result *= computeWinningOptions(times[i], distances[i]);
        }

    } catch (ex) {
        console.error("Error occurred: ", ex);
    }

    return result;
}

function computeWinningOptions(duration, recordDistance) {
    let options = 0;
    for (let i = 1; i < duration; i++) {
        const toTravel = (duration - i) * i;
        if (toTravel > recordDistance) {
            options++;
        }
    }

    console.log(`${duration} - ${recordDistance} ${options}`);
    return options;
}

module.exports = compute;