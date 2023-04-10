let globalCounter = 0;
let globalGraph = {};


// Adds a new node input to the page.
function addNode() {
    const nodeName = charify(globalCounter);
    $("#graphGenBox").append(
        $("<div>").addClass("node").attr("id", globalCounter).append(
            $("<label>").attr("for", "nodeName").text("Node: ")
        ).append(
            $("<input>").attr("type", "text").attr("id", "nodeName").attr("name", "nodeName").attr("readonly", "readonly").val(nodeName)
        ).append(
            $("<br>")
        ).append(
            $("<label>").attr("for", "neighbourSelect").text("Connecting Edges:")
        ).append(
            $("<div>").addClass("neighbours").attr("name", "neighbourSelect")
        )
    );

    // Add the new node as an option for the starting node selection
    $("#startingNode").append(
        $("<option>").attr("val", nodeName).text(nodeName)
    );

    // Need to add a new input in the neighbours section for each node
    populateNeighbours();
    // Increment the counter
    globalCounter++;
}

function populateNeighbours() {
    // Iterates over the neighbours section of each node,
    // and ensures there's an input for an edge to each other node.
    // It leaves existing inputs untouched, so any value already entered is preserved.
    $(".neighbours").each(function() {
        for (let i = 0; i <= globalCounter; i++) {
            if ($(this).children("#" + i).length == 0) {
                $(this).append(
                    $("<label>").attr("for", i).text(charify(i) + ": ")
                ).append(
                    $("<input>").addClass("edge").attr("name", i).attr("id", i).attr("type", "number")
                ).append(
                    $("<br>")
                )
            }
        }
    });
}

function generateGraph() {

    const startNode = $("#startingNode").val();

    if (startNode) {
        let graph = {}; // To hold the graph

        // Iterate over each node...
        $(".node").each(function() {
            // Add it to the graph
            const key = charify(parseInt($(this).attr("id")));
            // console.log("found node: " + key);
            graph[key] = {};

            // Find all of its connecting non-zero edges and add them to the graph
            $(this).find(".edge").each(function() {
                const subkey = charify(parseInt($(this).attr("id")));
                const dist = parseInt($(this).val());
                if (dist > 0) {
                    graph[key][subkey] = dist;
                }
            });

        });

        console.log(graph);
        globalGraph = graph;

        // Draw the graph on the canvas
        drawGraphOnCanvas(globalGraph);
        // Compute the cost to reach all nodes with both algorithms
        displayCostInTable(dijkstra(globalGraph, startNode), "t1");
        displayCostInTable(bellmanFord(globalGraph, startNode), "t2");
    } else {
        alert("Please enter starting node.");
    }
}

function displayCostInTable(obj, tid) {
    // Get a reference to the table element
    const table = $("#" + tid);

    table.find("tr").remove();

    // Header row of tables
    const headerRow = $('<tr>');
    headerRow.append($('<th>').text('Node'));
    headerRow.append($('<th>').text('Cost'));
    table.append(headerRow);

    // Loop through each property of the object and create a table row for it
    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const row = $('<tr>');
        row.append($('<td>').text(key));
        row.append($('<td>').text(value));
        table.append(row);
    });
}

function charify(n) {
    // Used to display the node names as letters instead of numbers
    // 0 -> A
    // 1 -> B
    // etc
    return String.fromCharCode(n + 65);
}

// Initial node.
addNode();

$("#startingNode").val("A");