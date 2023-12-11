const { readFile, toStringAndSplitBy } = require("../../utils");
const { resolve } = require("path");

/**
 * 
 */
async function compute(path = resolve("./src/day_7/input.txt"), partOne = false) {
    let result = 0;

    try {

        const transformers = [
           toStringAndSplitBy,
           (data) => splitEachLineOfTheListAndPrepare(data, partOne, /\s+/)
        ];

        const input = await readFile(path, transformers);


        // Sort
        const res = input.sort((a, b) => sortHands(a, b, partOne ? CARD_STRENGTH : CARD_STRENGTH_PART_TWO));

        for (let i = 0; i < res.length; i++) {
            result += (i + 1) * res[i].bid;
        }

    } catch (ex) {
        console.error("Error occurred: ", ex);
    }

    return result;
}

/**
 * 
 * @param {{hand: string, handStats: Object, strength: number, bid: number}} firstHand 
 * @param {{hand: string, handStats: Object, strength: number, bid: number}} secondHand 
 */
function sortHands(firstHand, secondHand, cardStrengthMap = CARD_STRENGTH) {
    if (firstHand.strength != secondHand.strength) {
        return secondHand.strength - firstHand.strength;
    }

    for (let i = 0; i < firstHand.hand.length; i++) {
        const firstHandCard = firstHand.hand.charAt(i);
        const secondHandCard = secondHand.hand.charAt(i);

        const firstHandCardStrength = cardStrengthMap[firstHandCard];
        const secondHandCardStrength = cardStrengthMap[secondHandCard];

        if (firstHandCardStrength == secondHandCardStrength) continue;

        if (firstHandCardStrength > secondHandCardStrength) {
            return -1;
        }

        return 1;
    }

    return 0;
}

function getStrongestHand(handStats, hand) {
    const tempStats = JSON.parse(JSON.stringify(handStats));
    
    const jokers = tempStats['J'];
    delete tempStats['J'];

    if (jokers < 1) {
        return computeHandType(tempStats);
    }

    if (Object.keys(tempStats).length < 1) { // Add when there are only J's
        tempStats['A'] = 1;
    }

    const sortedValues = Object.entries(handStats).sort(([aKey, aValue], [bKey, bValue]) => bValue - aValue);

    let bestResult = Number.MAX_SAFE_INTEGER;
    for (const [key, value] of sortedValues) {
        const temp = JSON.parse(JSON.stringify(tempStats));
        temp[key]++;
        temp['J'] = jokers - 1;

        bestResult = Math.min(getStrongestHand(temp), bestResult);
    }

    return bestResult;
}

function splitEachLineOfTheListAndPrepare(input, partOne = false, splitBy = /\s+/) {
    const output = [];
    for (const line of input) {
        const [hand, bid] = line.split(splitBy);
        const handStats = {};
    
        for (const card of hand) {
            if (!handStats[card]) {
                handStats[card] = 0;
            }
            handStats[card]++;
        }

        let strength = computeHandType(handStats);

        if (!partOne && handStats['J'] > 0) {
            // generate the strongest hand
            strength = getStrongestHand(handStats);
        }

        output.push({
            hand,
            handStats,
            strength,
            bid
        });
    }
    return output;
}

const CARD_STRENGTH = {
    A: 0,
    K: 1,
    Q: 2,
    J: 3,
    T: 4,
    9: 5,
    8: 6,
    7: 7,
    6: 8,
    5: 9,
    4: 10,
    3: 11,
    2: 12,
};

const CARD_STRENGTH_PART_TWO = {
    ...CARD_STRENGTH,
    J: 13
};

const HAND_TYPES_WITH_STRENGTH = {
    FIVE_OF_A_KIND: 0,
    FOUR_OF_A_KIND: 1,
    FULL_HOUSE: 2,
    THREE_OF_A_KIND: 3,
    TWO_PAIR: 4,
    ONE_PAIR: 5,
    HIGH_CARD: 6
};

function computeHandType(handStats) {
    const res = Object.values(handStats).sort((a, b) => b - a);

    if (res[0] == 5) {
        return HAND_TYPES_WITH_STRENGTH.FIVE_OF_A_KIND;
     }

    if (res[0] == 4) {
        return HAND_TYPES_WITH_STRENGTH.FOUR_OF_A_KIND;
    }

    if (res[0] == 3) {
        if (res[1] == 2) {
            return HAND_TYPES_WITH_STRENGTH.FULL_HOUSE;
        }
        return HAND_TYPES_WITH_STRENGTH.THREE_OF_A_KIND;
    }

    if (res[0] == 2) {
        if (res[1] == 2) {
            return HAND_TYPES_WITH_STRENGTH.TWO_PAIR;
        }
        return HAND_TYPES_WITH_STRENGTH.ONE_PAIR;
    }

    return HAND_TYPES_WITH_STRENGTH.HIGH_CARD;
}


module.exports = compute;