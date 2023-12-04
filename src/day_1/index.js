const { readFile, toStringAndSplitBy } = require("../../utils");
const Trie = require("../../data_structures/trie");
const { resolve } = require("path");

function is_numeric(str){
    return /^\d+$/.test(str);
}

function buildNumberTrie() {
    const numberWords = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
    };
    const numberTrie = new Trie();
    const reverseNumberTrie = new Trie();

    for(const [key, value] of Object.entries(numberWords)) {
        const reverseKey = key.split("").reverse().join("");
        numberTrie.insert(key, value);
        reverseNumberTrie.insert(reverseKey, value);
    }

    return { numberTrie, reverseNumberTrie };
}

function getCalibrationValueBasedOnFirstAndLastDigitEncountered(line, trie, reverseTrie) {
    const firstNumber = spelledNumberToDigit(line, trie);
    const lastNumber = spelledNumberToDigit(line.split("").reverse().join(""), reverseTrie);

    const res = parseInt(`${parseInt(firstNumber)}${parseInt(lastNumber)}`);

    if (Number.isNaN(res)) throw Error("NAN HERE");
    return res;
}

function spelledNumberToDigit(line, numberTrie) {
    let currentWord = '';

    for (const char of line) {
        if (is_numeric(char)) {
            if (char == '0') continue;
            return char;
        }

        if (!numberTrie) continue; // partOne only

        currentWord += char;
        let node = numberTrie.searchPrefix(currentWord);

        if (!node) {
            currentWord = char;
            continue;
        }

        if (node?.isEndOfWord) {
            return node.value;
        }
    }

    throw Error("SHOULDNT BE NULL");
}

/**
 * 
 */
async function compute(path = resolve("./src/day_1/input.txt"), partOne = false) {
    let sumOfCalibrationValues = 0;

    try {

        const transformers = [toStringAndSplitBy];

        const input = await readFile(path, transformers);

        const { numberTrie, reverseNumberTrie } = buildNumberTrie();

        for (const line of input) {
            sumOfCalibrationValues += getCalibrationValueBasedOnFirstAndLastDigitEncountered(line, !partOne ? numberTrie : null, !partOne ? reverseNumberTrie : null);
        }

    } catch (ex) {
        console.error("Error occurred: ", ex);
    }

    return sumOfCalibrationValues;
}

module.exports = compute;