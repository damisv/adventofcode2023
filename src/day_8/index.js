const { readFile, toStringAndSplitBy, circularIterator, lcm } = require("../../utils");
const { resolve } = require("path");

/**
 * 
 */
async function compute(path = resolve("./src/day_8/input.txt"), partOne = false) {
    let result = 0;

    try {

        const transformers = [
           toStringAndSplitBy,
        ];

        const input = await readFile(path, transformers);
        
        const [instructions, _, ...network] = input;

        const graph = buildGraph(network);

        if (partOne) {
            result = countSteps(instructions.split(""), graph, "AAA", (node) => node === "ZZZ");
        } else {
            const startNodes = Object.keys(graph).filter((node) => node.endsWith("A"));
            const stepsComputed = [];

            for (const node of startNodes) {
                stepsComputed.push(countSteps(instructions, graph, node, (currentNode) => currentNode.endsWith("Z")));
            }
            result = lcm(...stepsComputed);
        }

    } catch (ex) {
        console.error("Error occurred: ", ex);
    }

    return result;
}

function countSteps(instructions, graph, startNode, predicateFn) {
    const iterator = circularIterator(instructions);

    let steps = 0;
    let currentNode = startNode;

    while(!predicateFn(currentNode)) {
        steps++;
        currentNode = iterator.next().value == "R" ? graph[currentNode].right : graph[currentNode].left;
    }

    return steps;
}

function buildGraph(network) {
    const graph = {};

    for (const node of network) {
        const [nodeLabel, links] = node.split("=").map((str) => str.trim());
        const [leftNode, rightNode] = links.replace(/\(|\)/g, "").split(",").map((str) => str.trim());

        graph[nodeLabel] = {
            left: leftNode,
            right: rightNode
        };
    }

    return graph;
}

module.exports = compute;