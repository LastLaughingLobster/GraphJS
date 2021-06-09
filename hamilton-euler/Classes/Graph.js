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
      this.node = this.createNodes();
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

  //-------------IMPLEMENTAÇÕES DJIKSTRA / HAMILTON CYCLE / EULER CYCLE ------------

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

  initHamilton = () => {
    this.Nodes.forEach((node) => {
      node.color = "#ffffff";
    });
    this.Edges.forEach((edge) => {
      edge.color = "#525252";
    });
  };

  halmiltonianPath = (node, size, path) => {
    if (!node.isInArray(path)) {
      path.push(node.name);

      if (path.length == size) {
        return path;
      }

      let addNodes = node.getExitNodes();
      let allOther = [];
      for (let exitNode of addNodes) {
        let resNodes = [...path];
        let candidates = this.halmiltonianPath(exitNode, size, resNodes);
        if (candidates != null) {
          allOther = allOther.concat(candidates);
        }
      }
      return allOther;
    }
    return null;
  };

  halmiltonian = (searchNode) => {
    this.initHamilton();
    let len = this.Nodes.length;
    let paths = this.halmiltonianPath(searchNode, len, []);
    let pathString = paths.reduce((name1, name2) => name1 + name2);
    let pathsArr = pathString.split(searchNode.name).filter(function (str) {
      return /\S/.test(str);
    });

    const findUnq = (array = []) => {
      array = [...new Set(array)];
      return array.filter((str) => str.length == len - 1);
    };
    pathsArr = findUnq(pathsArr);

    let newCycles = [];
    for (let path of pathsArr) {
      let nodes = path.split("");
      nodes = [...new Set(nodes)];

      if (nodes.length == len - 1) {
        let lastNode = this.findNodeByName(nodes[nodes.length - 1]);
        let exitNodes = lastNode.getExitNodesNames();
        for (var nd of exitNodes) {
          if (nd == searchNode.name) {
            nodes = [searchNode.name].concat(nodes);
            newCycles.push(nodes);
          }
        }
      }
    }

    let bestCycle = this.findBestCycle(newCycles);
    console.warn(bestCycle.cycle);
    this.paintCycles(bestCycle.cycle);

    return bestCycle;
  };

  findBestCycle = (cycles) => {
    const sumCycle = (node, path = [], index = 1, sum = 0) => {
      let nextNode = this.findNodeByName(path[index]);
      let thisEdge;
      this.Edges.forEach((edge) => {
        if (edge.nodeOne == node && edge.nodeTwo == nextNode) {
          thisEdge = edge;
        }
      });
      if (thisEdge) {
        sum += thisEdge.weight;
        if (index >= this.Nodes.length) {
          return sum;
        }
        let returnn = sumCycle(thisEdge.nodeTwo, path, index + 1, sum);
        return returnn;
      }
    };

    let bestCycle = { sum: Number.MAX_SAFE_INTEGER, cycle: [] };
    for (let cycle of cycles) {
      let node = this.findNodeByName(cycle[0]);
      let cycleSum;
      cycle.push(cycle[0]);
      if (node) {
        cycleSum = sumCycle(node, cycle, 1, 0);
      }
      if (cycleSum < bestCycle.sum) {
        bestCycle.sum = cycleSum;
        bestCycle.cycle = cycle;
      }
      cycle.pop();
    }

    return bestCycle;
  };

  findNodeByName = (searchNodeName) => {
    for (var node of this.Nodes) {
      if (node.name == searchNodeName) {
        return node;
      }
    }
    return null;
  };

  isAnEulerCycle = () => {
    for (var node of this.Nodes) {
      if (node.edges.length % 2 != 0) {
        return false;
      }
    }
    return true;
  };

  eulerianCycle = () => {
    this.initHamilton();
    if (this.isAnEulerCycle()) {
      this.Edges.forEach((edge) => {
        edge.color = "#4285F4";
      });
      return {
        cycle: this.Edges.map((edge) => edge.name),
        sum: this.Edges.reduce((a, b) => a.weight + b.weight),
      };
    }
    return [];
  };

  // -------------------------

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
      if (thisEdge) {
        thisEdge.color = "#4285F4";
        this.paintPath(thisEdge.nodeOne);
      }
    }
  }

  paintCycles = (cycle) => {
    const paint = (node, path = [], index = 1) => {
      let nextNode = this.findNodeByName(path[index]);
      let thisEdge;
      this.Edges.forEach((edge) => {
        if (edge.nodeOne == node && edge.nodeTwo == nextNode) {
          thisEdge = edge;
        }
      });

      if (thisEdge) {
        thisEdge.color = "#4285F4";
        node.color = "#ff6961";
        if (index > this.Nodes.length) {
          return;
        }
        paint(thisEdge.nodeTwo, path, index + 1);
      }
    };
    let node = this.findNodeByName(cycle[0]);
    cycle.push(cycle[0]);
    if (node) {
      paint(node, cycle, 1);
    }
    cycle.pop();
  };
}
