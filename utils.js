let fs = require('fs').promises;

function isNumeric(str){
    return /^\d+$/.test(str);
}

/**
 * 
 * @param {*} data 
 * @returns Array of strings
 */
function toStringAndSplitBy(data, separator = "\n") {
    return data.toString().split(separator);
}

/**
 * 
 * @param {*} data 
 * @param {*} toReplace 
 * @param {*} withReplace 
 * @returns 
 */
function replaceChars(data, toReplace = /\s+/g, withReplace = "_") {
    return data.toString().replace(toReplace, withReplace);
}

/**
 * Given an array, it will iterate through it circularly
 * @param {Array<any>} array 
 */
function* circularIterator(array) {
    let index = 0;
    while (true) {
        if (index >= array.length) {
            index = 0;
        }
        yield array[index++];
    }
}

/**
 * 
 * @param {*} functionTocall 
 * @param {*} arguments 
 * @returns 
 */
function proxyFormatter(functionTocall, arguments) {
    return (data) => {
        return functionTocall(data, ...arguments);
    };
}

/**
 * 
 * @param {*} data 
 * @returns 
 */
function joinString(data) {
    return data.join("");
}

/**
 * 
 * @param {*} data 
 * @param {*} radix 
 * @returns 
 */
function toInteger(data, radix = 10) {
    return data.map((string) => parseInt(string, radix));
}

/**
 * 
 * @param {*} path 
 * @param {*} transformers 
 * @returns 
 */
async function readFile(path, transformers = [toStringAndSplitBy]) {
    const data = await fs.readFile(path);

    if (!transformers.length) return data;

    let temp = data;
    for (const transformer of transformers) {
        temp = transformer(temp);
    }

    return temp;
}

/**
 * Returns the greatest common denominator of the two values.
 * @param {number} a
 * @param {number} b
 */
function gcd(a, b) {
    return (b === 0 ? a : gcd(b, a % b));
}

/**
 * Computes the least common multiple between the two numbers
 * @param {number} a
 * @param {number} b
 */
function doLcm(a, b) {
    return (a * b) / gcd(a, b);
}

/**
 * Computes the least common multiple between the numbers.
 * @param {...number} numbers
 */
function lcm(...numbers) {
  if (numbers.length < 2) {
    throw new RangeError("need at least two numbers");
  }
  return numbers.reduce((acc, x) => doLcm(acc, x), 1);
}

module.exports = {
    readFile,

    toStringAndSplitBy,
    replaceChars,
    proxyFormatter,
    joinString,
    toInteger,
    isNumeric,

    circularIterator,

    // MATH
    lcm,
    doLcm,
    gcd,
};