const { readFile, toStringAndSplitBy } = require("../../utils");
const { resolve } = require("path");

/**
 * 
 */
async function compute(path = resolve("./src/day_5/input.txt"), partOne = false) {
    let result = 0;

    try {

        const transformers = [
            toStringAndSplitBy,
        ];

        const input = await readFile(path, transformers);

    } catch (ex) {
        console.error("Error occurred: ", ex);
    }

    return result;
}

module.exports = compute;