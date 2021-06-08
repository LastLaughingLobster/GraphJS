class Graph {
  init(
    height,
    width,
    isDirectional = false,
    weighted = false,
    createRandomEdges = false
  ) {
    this.isDirectional = isDirectional;
    this.isWeighted = weighted;
    this.nodeName = 65;
    this.height = height;
    this.width = width;
    this.Edges = [];
    if (createRandomEdges) {
      this.Nodes = this.createNodes();
    } else {
      this.Nodes = [];
    }
  }

  //questoões
  //retorna a ordem
  getOrder() {
    return this.Nodes.length;
  }

  //retorna o tamano
  getSize() {
    return this.Edges.length;
  }

  createNodes() {
    let nodes = [];
    for (let i = 0; i < this.Nvertices; i++) {
      let x = noise(0.0 + i / 100.0) * this.width;
      let y = noise(1.0 - i / 100.0) * this.height;
      nodes.push(new Node(x, y, 50));
    }
    return nodes;
  }

  pushNewNode(x, y, diameter) {
    this.Nodes.push(
      new Node(x, y, diameter, String.fromCharCode(this.nodeName))
    );
    this.Nvertices++;
    this.nodeName++;
  }

  pushNode(node) {
    this.Nodes.push(node);
    this.Nvertices++;
  }

  pushNewEdge(nodeOne, nodeTwo) {
    if (!nodeOne || !nodeTwo) {
      return;
    }
    let newEdge = new Edge(nodeOne, nodeTwo);
    newEdge.name = "(" + nodeOne.name + "," + nodeTwo.name + ")";
    nodeOne.pushEdge(newEdge);
    nodeTwo.pushEdge(newEdge);
    this.Edges.push(newEdge);
    return;
  }

  //refactor later f(this.Nodes.mouseOnEdge())
  mouseOnNode(inCanvas) {
    if (inCanvas) {
      for (let i = 0; i < this.Nodes.length; i++) {
        if (
          dist(mouseX, mouseY, this.Nodes[i].x, this.Nodes[i].y) <=
          this.Nodes[i].diameter / 2
        ) {
          return this.Nodes[i];
        }
      }
    }
    return null;
  }

  mouseOnEdges(inCanvas) {
    if (inCanvas) {
      for (let i = 0; i < this.Edges.length; i++) {
        if (this.Edges[i].edgeClicked(mouseX, mouseY)) {
          return this.Edges[i];
        }
      }
    }
    return null;
  }

  showNodes() {
    this.Nodes.forEach((node) => {
      node.draw();
    });
  }

  printNodes() {
    let nodeNames = [];
    this.Nodes.forEach((node) => {
      nodeNames.push(node.name);
    });
    console.log(nodeNames);
  }

  showEdges() {
    this.Edges.forEach((edge) => {
      edge.draw(this.isDirectional, this.isWeighted);
    });
  }

  printEdges() {
    let edgeNames = [];
    this.Edges.forEach((edge) => {
      edgeNames.push(edge.name);
    });
    console.log(edgeNames);
  }

  KNGraph(n) {
    return (n * (n - 1)) / 2;
  }

  deleteNode(nodeToBeDeleted) {
    this.Edges = this.Edges.filter(
      (edge) =>
        !(nodeToBeDeleted === edge.nodeOne || nodeToBeDeleted === edge.nodeTwo)
    );
    console.log(this.Edges);
    this.Nodes = this.Nodes.filter((node) => node !== nodeToBeDeleted);
  }

  deleteEdge(edgeToBeDeleted) {
    this.Edges = this.Edges.filter((edge) => edge !== edgeToBeDeleted);
  }

  initDkstra(startNode, endNode) {
    let output = [];
    let allOtherNodes = this.Nodes.filter(
      (node) => node.name != startNode.name && node.name != endNode.name
    );
    this.Nodes.forEach((node) => {
      node.djikstra.sumWeight = Number.MAX_SAFE_INTEGER;
      node.djikstra.lastNode = null;
      node.djikstra.visited = false;
    });
    startNode.djikstra.sumWeight = 0;
    output.push(startNode);
    allOtherNodes.forEach((node) => {
      output.push(node);
    });
    output.push(endNode);

    this.Edges.forEach((edge) => {
      edge.color = "#525252";
    });
    return output;
  }

  djikstra = (startNode, endNode) => {
    let allNodes = [];
    let ordedNodes = this.initDkstra(startNode, endNode);
    while (ordedNodes.length > 0) {
      let currentNode = ordedNodes.shift();
      let exits = currentNode.getExitEdges();
      exits.forEach((edge) => {
        let sum = currentNode.djikstra.sumWeight + edge.weight;
        if (!edge.nodeTwo.djikstra.visited) {
          if (sum < edge.nodeTwo.djikstra.sumWeight) {
            edge.nodeTwo.djikstra.sumWeight = sum;
            edge.nodeTwo.djikstra.lastNode = currentNode;
          }
        }
      });
      currentNode.djikstra.visited = true;
      allNodes.push(currentNode);
      ordedNodes.sort((a, b) => {
        return a.djikstra.sumWeight - b.djikstra.sumWeight;
      });
    }
  };

  paintPath(node) {
    if (node == null) {
      return;
    } else {
      let thisEdge;
      this.Edges.forEach((edge) => {
        if (edge.nodeTwo == node && node.djikstra.lastNode == edge.nodeOne) {
          thisEdge = edge;
        }
      });
      thisEdge.color = "#4285F4";
      this.paintPath(thisEdge.nodeOne);
    }
  }
}
