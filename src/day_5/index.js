const { readFile, toStringAndSplitBy } = require("../../utils");
const { resolve } = require("path");

/**
 * 
 */
async function compute(path = resolve("./src/day_5/input.txt"), partOne = false) {
    let result = Number.MAX_SAFE_INTEGER;

    try {

        const transformers = [
            (data) => toStringAndSplitBy(data, "\n\n"),
        ];

        const input = await readFile(path, transformers);

        let seeds = input[0].split(`seeds:`)[1].trim().split(/\s+/).map((number) => parseInt(number));
        
        // More Parsing Of Input
        const maps = {};
        const mapsKeys = ["seed-to-soil", "soil-to-fertilizer", "fertilizer-to-water", "water-to-light", "light-to-temperature", "temperature-to-humidity", "humidity-to-location"];
        {
            let i = 0;
            for (const key of mapsKeys) {
                i++;
                const parsedLines = input[i].split(`${key} map:`)[1].trim().split("\n");
                const map = [];

                for (const line of parsedLines) {
                    map.push(line.trim().split(/\s+/).map((number) => parseInt(number)));
                }
                maps[key] = map;
            }
        }
        //

        if (!partOne) {
            // TODO: compute by ranges instead of brute force
            for (let i = 0; i < seeds.length; i += 2) {
                const rangeStart = seeds[i];
                const rangeEnd = rangeStart + seeds[i + 1];

                let j = rangeStart;
                while (j <= rangeEnd) {
                    let number = j;
                    for (const key of mapsKeys) {
                        number = mapNumber(number, maps[key]);                    
                    }
                    result = Math.min(result, number);
                    j++;
                }
            }
        } else {
            for (const seed of seeds) {
                let number = seed;
                for (const key of mapsKeys) {
                    number = mapNumber(number, maps[key]);                    
                }
                result = Math.min(result, number);
            }
        }

    } catch (ex) {
        console.error("Error occurred: ", ex);
    }

    return result;
}

function mapNumber(number, map) {
    let result = number;

    for (const line of map) {
        const [destinationRangeStart, sourceRangeStart, rangeLength] = line;

        if (number >= sourceRangeStart && number <= sourceRangeStart + rangeLength) {
            const diff = number - sourceRangeStart;
            result = destinationRangeStart + diff;
            break;
        }
    }

    return result;
}

module.exports = compute;