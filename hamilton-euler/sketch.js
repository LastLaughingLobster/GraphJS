let graph;
let button;

let weightInput;
let inputButton;
let downloadButton;
let directionalButton;
let weightedButton;
let djikstraButton;
let hamiltonButton;
let eulerButton;
let canva;
let djikstraToggle = true;
let HamiltonToggle = true;

//change to array later
let uiNode = null;
let lastUiNode = null;
let selectedNode = null;
let releasedNode = null;
let selectedEdge = null;
let releasedEdge = null;

let nodeMode = true;
let directionalMode = false;
let weightedMode = false;

let bestCycle = null;

const diameter = 50;

const backgroundColor = "#D4D4D4";
const nodeColor = "#ffffff";
const edgeColor = "#525252";
const selectedEdgeColor = "#CD2D2A";
const selectNodeColor = "#4285F4";
const lastSelectedNodeColor = "#0F9D58";

function setup() {
  canva = createCanvas(800, 800);
  graph = new Graph();
  graph.init(20, 20, 800, 800);
  uiButtonsAndInputs();
}

function draw() {
  background(backgroundColor);
  mouseBeingPressed();
  graph.showEdges();
  graph.showNodes();
  showMeta();
}

function mousePressed() {
  if (mouseOnCanvas()) {
    if (nodeMode) {
      selectedNode = graph.mouseOnNode(mouseOnCanvas());
      if (lastUiNode && uiNode) {
        lastUiNode.textColor = "#000000";
      }
      lastUiNode = uiNode;
      if (lastUiNode && uiNode) {
        lastUiNode.textColor = lastSelectedNodeColor;
      }
      uiNode = selectedNode;
      if (lastUiNode && uiNode) {
        uiNode.textColor = selectNodeColor;
      }
      if (!selectedNode) {
        graph.pushNewNode(mouseX, mouseY, diameter);
      }
    } else {
      selectedNode = graph.mouseOnNode(mouseOnCanvas());
      if (!selectedNode) {
        changeSelectedEdgeColor();
        selectedEdge = graph.mouseOnEdges(mouseOnCanvas());
        changeSelectedEdgeColor("red");
      }
    }
  }

  // console.log(graph.printNodes());
  // console.log(graph.printEdges());
}

function keyPressed() {
  if (keyCode == 8) {
    //delete key code
    if (nodeMode) {
      graph.deleteNode(uiNode);
      uiNode = lastUiNode;
      lastUiNode = null;
    } else {
      graph.deleteEdge(selectedEdge);
      selectedEdge = null;
    }
  }
}

function mouseReleased() {
  releasedNode = graph.mouseOnNode(mouseOnCanvas());
  if (mouseOnCanvas()) {
    if (releasedNode) {
      if (releasedNode !== selectedNode) {
        graph.pushNewEdge(selectedNode, releasedNode);
      }
      releasedNode = null;
      selectedNode = null;
    }
  }
}

function mouseBeingPressed() {
  if (mouseIsPressed) {
    if (nodeMode) {
      if (selectedNode && mouseOnCanvas()) {
        selectedNode.x = mouseX;
        selectedNode.y = mouseY;
      }
    } else {
      drawPointer();
    }
    drawPointer();
  }
}

function mouseOnCanvas() {
  let boolWidth = mouseX <= width && mouseX >= 0;
  let boolHeight = mouseY <= height && mouseY >= 0;
  return boolWidth && boolHeight;
}

function drawPointer() {
  if (selectedNode && mouseOnCanvas()) {
    stroke(0);
    strokeWeight(10); //change later to constructor value
    line(selectedNode.x, selectedNode.y, mouseX, mouseY);
  }
}

function uiButtonsAndInputs() {
  let sideOfCanva = 19 + 800;
  button = createButton("Change to Edge Mode");
  button.position(sideOfCanva, 19);
  button.mousePressed(changeNodeMode);

  weightedButton = createButton("Enable  Weighted Mode");
  weightedButton.position(sideOfCanva, 49);
  weightedButton.mousePressed(changeWeighted);

  weightInput = createInput("");
  weightInput.position(sideOfCanva, 79);
  weightInput.input(inputFunction);

  inputButton = createButton("Add Weight");
  inputButton.position(sideOfCanva + 150, 79);
  inputButton.mousePressed(addWeight);

  downloadButton = createButton("Download Graph");
  downloadButton.position(sideOfCanva, 109);
  downloadButton.mousePressed(downloadCanva);

  directionalButton = createButton("Make Graph Directed");
  directionalButton.position(sideOfCanva, 139);
  directionalButton.mousePressed(changeDirectional);

  djikstraButton = createButton("Djikstra Button");
  djikstraButton.position(sideOfCanva, 169);
  djikstraButton.mousePressed(callDjikstra);

  hamiltonButton = createButton("Hamilton Button");
  hamiltonButton.position(sideOfCanva, 199);
  hamiltonButton.mousePressed(callHamilton);

  eulerButton = createButton("Euler Button");
  eulerButton.position(sideOfCanva, 229);
  eulerButton.mousePressed(callEuler);
}

function callDjikstra() {
  if (lastUiNode && uiNode) {
    let a = graph.djikstra(lastUiNode, uiNode);
    djikstraToggle = true;
    if (!uiNode.djikstra.lastNode) {
      console.log("Edges Not Conected", -1);
      djikstraToggle = false;
    }
    graph.paintPath(uiNode);
  }
}

function callHamilton() {
  if (lastUiNode && uiNode) {
    bestCycle = graph.halmiltonian(lastUiNode, graph.Nodes.length);
    console.info("Cycles:  ", bestCycle);
  }
}

function callEuler() {
  if (lastUiNode) {
    let a = graph.eulerianCycle(lastUiNode);
    console.warn("Euler", a);
  }
}

function changeNodeMode() {
  nodeMode = !nodeMode;
  if (nodeMode) {
    button.html("Change to Edge Mode");
    changeSelectedEdgeColor();
  } else {
    button.html("Change to Node Mode");
  }
}

function changeDirectional() {
  directionalMode = !directionalMode;
  if (directionalMode) {
    directionalButton.html("Make Graph Undirected");
  } else {
    directionalButton.html("Make  Graph  Directed");
  }
  graph.isDirectional = directionalMode;
}

function changeWeighted() {
  weightedMode = !weightedMode;
  if (weightedMode) {
    weightedButton.html("Disable Weighted Mode");
  } else {
    weightedButton.html("Enable  Weighted Mode");
  }
  graph.isWeighted = weightedMode;
}

function inputFunction() {
  //console.log('Input = ', this.value());
}

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

function addWeight() {
  let value = weightInput.value();
  if (isNumeric(value) && selectedEdge) {
    selectedEdge.weight = parseInt(value);
  } else {
    console.log("Invalid format: (Use Intergers)");
  }
  weightInput.value("");
  changeSelectedEdgeColor();
}

function downloadCanva() {
  saveCanvas(
    canva,
    "grap(" + String(Math.floor(Math.random() * 1000)) + ")",
    "jpg"
  );
}

function changeSelectedEdgeColor(color = "default") {
  if (selectedEdge) {
    if (color == "red") {
      selectedEdge.color = selectedEdgeColor;
    }
    if (color == "default") {
      selectedEdge.color = edgeColor;
    }
  }
}

// function addCompareNodes(selected){
//   if(comparedNodes.length <= 1){
//     comparedNodes.push(selected);
//   }else{
//     comparedNodes.push(selected);
//     comparedNodes.shift();
//   }
//   console.log(comparedNodes);
// }

function showMeta() {
  textSize(20);
  fill(0);
  text("Ordem   do   Grafo: " + graph.getOrder(), 30, 720);
  text("Tamanho do Grafo: " + graph.getSize(), 30, 750);
  let name = "Ø";
  let adj = "Ø";
  let adjN = 0;
  if (uiNode) {
    let obj = uiNode.getAdjecentNodes();
    adj = obj.adjacentes.toString();
    adjN = obj.adjacentes.length;
    name = uiNode.name;
    // if (directionalMode) {
    //   text(
    //     "Nós de Saida: " + obj.saida.toString() + " (" + obj.saida.length + ")",
    //     250,
    //     750
    //   );
    //   text(
    //     "Nós de Entrada: " +
    //       obj.entrada.toString() +
    //       " (" +
    //       obj.entrada.length +
    //       ")",
    //     250,
    //     780
    //   );
  }

  text("Nó selecionado: " + name, 30, 780);
  text("Adjacencia do Nó " + name + " : " + adj + " (" + adjN + ")", 250, 720);
  if (bestCycle) {
    text("Best Cycle " + name + " : " + bestCycle.cycle, 250, 750);
    text("Best Cycle Sum : " + bestCycle.sum, 250, 780);
  }

  let conection = "<->";
  let Node1 = "Ø";
  let Node2 = "Ø";
  if (lastUiNode && uiNode) {
    let obj = uiNode.getAdjecentNodes();
    Node1 = uiNode.name;
    Node2 = lastUiNode.name;
    if (obj.adjacentes.find((e) => e == lastUiNode.name)) {
      conection = " é adjacente ao ";
    } else {
      conection = " não é adjacente ao ";
    }
    text("Nó " + Node2 + conection + Node1, 550, 720);
  }

  if (lastUiNode && uiNode) {
    textSize(32);
    fill(lastUiNode.textColor);
    text(lastUiNode.name, 550, 770);
    fill(0);
    text("→", 580, 770);
    fill(uiNode.textColor);
    text(uiNode.name, 620, 770);
    fill(0);
    if (uiNode.djikstra.sumWeight != Number.MAX_SAFE_INTEGER) {
      text(uiNode.djikstra.sumWeight, 650, 770);
    }
    if (!djikstraToggle) {
      fill(0);
      text("-1", 660, 770);
    }
  }

  // let adj = uiNode.getAdjecentNodes();

  // adj = adj.adjacentes.toString();
}

// TestBench

function graphShowClosetNodeOnClick() {
  console.log(graph.closestEdgeToPoint(mouseX, mouseY));
}
