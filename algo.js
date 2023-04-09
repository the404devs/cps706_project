function dijkstra(graph, start) {
    const distances = {};
    const visited = {};
    let unvisited = Object.keys(graph);

    unvisited.forEach((node) => {
        distances[node] = Infinity;
    });

    distances[start] = 0;

    while (unvisited.length > 0) {
        let currentNode = null;

        unvisited.forEach((node) => {
            if (currentNode === null || distances[node] < distances[currentNode]) {
                currentNode = node;
            }
        });

        const neighbors = graph[currentNode];

        for (let neighbor in neighbors) {
            let distance = neighbors[neighbor];
            let newDistance = distances[currentNode] + distance;

            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
                console.log(`Edge ${currentNode} to ${neighbor}`);
            }
        }

        visited[currentNode] = distances[currentNode];
        unvisited = unvisited.filter((node) => node !== currentNode);
    }

    return visited;
}


function bellmanFord(graph, startNode) {
    let distances = {};
    let previous = {};

    for (let node in graph) {
        distances[node] = Infinity;
        previous[node] = null;
    }

    distances[startNode] = 0;

    for (let i = 0; i < Object.keys(graph).length - 1; i++) {
        for (let node in graph) {
            for (let neighbor in graph[node]) {
                let distance = graph[node][neighbor];
                if (distances[node] + distance < distances[neighbor]) {
                    distances[neighbor] = distances[node] + distance;
                    previous[neighbor] = node;
                }
            }
        }
    }

    // return { distances, previous };
    return distances
}


globalGraph = {
    A: { B: 1, C: 2 },
    B: { D: 3 },
    C: { D: 4 },
    D: { E: 5 },
    E: {},
};

// drawGraphOnCanvas(globalGraph);

console.log(globalGraph);

console.log(dijkstra(globalGraph, "A"));
console.log("--------------");
console.log(bellmanFord(globalGraph, "A"));