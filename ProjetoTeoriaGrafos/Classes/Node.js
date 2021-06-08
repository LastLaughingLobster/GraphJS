class Node {
  constructor(x, y, diameter, name = "@") {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.color = "#ffffff";
    this.edges = [];
    this.name = name;
    this.djikstra = {
      sumWeight: Number.MAX_SAFE_INTEGER,
      lastNode: null,
      visited: false,
    };
    this.textColor = "#000000";
  }

  draw() {
    fill(this.color);
    noStroke();
    circle(this.x, this.y, this.diameter);
    textSize(24);
    fill(this.textColor);
    text(
      this.name,
      this.x - this.diameter / 4 + 5,
      this.y - this.diameter / 4,
      this.diameter * 0.8
    );
  }

  pushEdge(edge) {
    this.edges.push(edge);
  }

  getAdjecentNodes() {
    let out = { adjacentes: [], saida: [], entrada: [] };
    this.edges.forEach((edge) => {
      let name;
      if (edge.nodeOne == this) {
        name = edge.nodeTwo.name;
        out.saida.push(name);
      } else {
        name = edge.nodeOne.name;
        out.entrada.push(name);
      }
      out.adjacentes.push(name);
    });
    return out;
  }

  getExitEdges() {
    let out = [];
    this.edges.forEach((edge) => {
      if (edge.nodeOne == this) {
        out.push(edge);
      }
    });
    return out;
  }

  getInputEdges() {
    let out = [];
    this.edges.forEach((edge) => {
      if (edge.nodeOne != this) {
        out.push(name);
      }
    });
    return out;
  }
}
