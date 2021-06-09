class Edge {
  // regra de vetores direcionais nodeOne ->  nodeTwo
  constructor(nodeOne, nodeTwo, weight = 0, color = "#525252", stroke = 12) {
    this.nodeOne = nodeOne;
    this.nodeTwo = nodeTwo;
    this.weight = weight;
    this.color = color;
    this.stroke = stroke;
    this.name;
    this.centerPointX;
    this.centerPointY;
    this.visited = false;
  }

  draw(isDirectional, isWeighted) {
    stroke(this.color);
    strokeWeight(this.stroke); //change later to constructor value
    line(this.nodeOne.x, this.nodeOne.y, this.nodeTwo.x, this.nodeTwo.y);
    textSize(this.stroke * 0.8);

    let x = (this.nodeOne.x + this.nodeTwo.x) / 2;
    let y = (this.nodeOne.y + this.nodeTwo.y) / 2;
    this.centerPointX = x;
    this.centerPointY = y;

    //if here
    if (isDirectional) {
      fill(255);
      let diX = (x + this.nodeTwo.x) / 2;
      let diY = (y + this.nodeTwo.y) / 2;
      circle(diX, diY, this.stroke / 3);
    }
    if (isWeighted) {
      let diameter = this.stroke * 1.2;
      textSize(this.stroke * 0.8);
      fill(0);
      circle(x, y, diameter);
      fill(255);
      text(
        this.weight.toString(),
        x - diameter / 4,
        y - diameter / 4,
        this.stroke * 1.6
      );
    }
  }

  edgeLenght() {
    return dist(this.nodeOne.x, this.nodeOne.y, this.nodeTwo.x, this.nodeTwo.y);
  }

  distanceToPoint(pointX, pointY) {
    // Implementation of Hurons Algorithm;
    let edgeLegth = this.edgeLenght();
    let distNode1 = dist(this.nodeOne.x, this.nodeOne.y, pointX, pointY);
    let distNode2 = dist(this.nodeTwo.x, this.nodeTwo.y, pointX, pointY);
    let HPe = (edgeLegth + distNode1 + distNode2) / 2;
    let area = sqrt(
      HPe * (HPe - edgeLegth) * (HPe - distNode1) * (HPe - distNode2)
    );
    return (area * 2) / edgeLegth;
  }

  edgeClicked(mausX, mausY) {
    let distance = dist(this.centerPointX, this.centerPointY, mausX, mausY);
    if (
      this.distanceToPoint(mausX, mausY) <= this.stroke &&
      distance < this.edgeLenght() / 2
    ) {
      return true;
    }
    return false;
  }

  nodeOnEdge(node) {
    if (node === this.nodeOne || node === this.nodeTwo) {
      return true;
    }
    return false;
  }

  isInArray(edgeNameArray = []) {
    for (var edge of edgeNameArray) {
      if (edge == this.name) {
        return true;
      }
    }
    return false;
  }
}
