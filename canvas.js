function drawGraphOnCanvas(graph) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const startNode = $("#startingNode").val();

    // const graph = {
    //   A: { B: 1, C: 2 },
    //   B: { D: 3 },
    //   C: { D: 4 },
    //   D: { E: 5 },
    //   E: {},
    // };

    // Set the size of the canvas
    canvas.width = 500;
    canvas.height = 500;

    // Set the font style and size
    ctx.font = 'bold 16px Arial';

    // Set the node size and colour
    const nodeSize = 30;
    const nodeRadius = nodeSize / 2;
    const nodeColor = '#2ecc71';
    const nodeColorAlt = '#f00';

    // Set the line colour and width
    const lineColor = '#34495e';
    const lineWidth = 2;



    // Set the text colour 
    const textColor = '#000000'

    // Calculate the position of each node on the canvas

    const positions = {};
    Object.keys(graph).forEach((node, i) => {
        // Attempting to space the nodes out nicely
        const angle = (2 * Math.PI * i) / Object.keys(graph).length;
        const x = (canvas.width / 2) + Math.cos(angle) * (canvas.width / 2);
        const y = (canvas.height / 2) + Math.sin(angle) * (canvas.height / 2);

        // Checks to make sure the nodes aren't cut off at the edge of the canvas
        const leftBoundary = nodeSize * 2;
        const rightBoundary = canvas.width - nodeSize * 2;
        const topBoundary = nodeSize * 2;
        const bottomBoundary = canvas.height - nodeSize * 2;
        const adjustedX = Math.max(leftBoundary, Math.min(rightBoundary, x));
        const adjustedY = Math.max(topBoundary, Math.min(bottomBoundary, y));
        positions[node] = { X: adjustedX, Y: adjustedY };
    });


    // Loop through each node in the graph
    for (const node in graph) {

        // Get node's position
        x = positions[node].X;
        y = positions[node].Y;

        // Loop through each connected node
        for (const connectedNode in graph[node]) {
            // Get the coordinates for the connected node
            const connectedX = positions[connectedNode].X;
            const connectedY = positions[connectedNode].Y;

            // Calculate the angle of the line
            const angle = Math.atan2(connectedY - y, connectedX - x);

            const lineStartX = x - nodeRadius * Math.cos(angle);
            const lineStartY = y - nodeRadius * Math.sin(angle);
            const lineEndX = connectedX - nodeRadius * Math.cos(angle);
            const lineEndY = connectedY - nodeRadius * Math.sin(angle);


            // Define the control point for the curve
            const curveDepth = 50;
            const curveX = (x + connectedX) / 2 + curveDepth * Math.sin(angle);
            const curveY = (y + connectedY) / 2 - curveDepth * Math.cos(angle);


            // Draw the line
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(lineStartX, lineStartY);
            ctx.quadraticCurveTo(curveX, curveY, lineEndX, lineEndY);
            ctx.stroke();

            // Calculate the distance between the nodes
            const distance = graph[node][connectedNode];

            // Draw the distance label
            ctx.fillStyle = textColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(distance, curveX / 2, curveY / 2);

            // Draw the arrowhead
            const arrowAngle = Math.atan2(curveY, curveX);
            const arrowSize = 15;
            ctx.save();
            ctx.beginPath();
            ctx.translate(lineEndX, lineEndY);
            ctx.rotate(angle + arrowAngle / 2 + Math.PI);
            ctx.moveTo(0, 0);
            ctx.lineTo(arrowSize, -arrowSize / 2);
            ctx.lineTo(arrowSize, arrowSize / 2);
            ctx.closePath();
            ctx.restore();
            ctx.fillStyle = lineColor;
            ctx.fill();
        }

        // Draw the node
        // We do this after drawing connecting lines, 
        // otherwise they will be shown on top of the node label.
        // Nodes are green, starting node is red.
        if (node == startNode) {
            ctx.fillStyle = nodeColorAlt;
        } else {
            ctx.fillStyle = nodeColor;
        }

        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw the node label
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node, x, y);
    }
}