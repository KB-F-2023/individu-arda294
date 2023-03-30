interface Vertex {
    name: string,
    color: string,
    neighbors: number[]
}

const createVertex = (name: string, color: string = "undefined", neighbors:any[] = []):Vertex => {
    return {
        name: name,
        color: color,
        neighbors: neighbors
    }
}

const randomInt = (start: number, end: number): number => {
    return Math.floor(Math.random() * (end-start+1)) + start
}

class Graph {
    private name: string
    public nodes: Vertex[] = []

    public constructor(name: string) {
        this.name = name
    }

    public getName() {
        return this.name
    }

    public getSize() {
        return this.nodes.length
    }

    public addNode(name: string, color: string = "undefined", neighbors:any[] = []) {
        this.nodes.push(createVertex(name, color, neighbors))
    }

    public addEdge(a: string, b: string) {
        var aIndex = this.nodes.findIndex((val) => (val.name === a));
        var bIndex = this.nodes.findIndex((val) => (val.name === b));
        this.nodes[aIndex].neighbors.push(bIndex)
        this.nodes[bIndex].neighbors.push(aIndex)
    }

    public checkConflict(name: string): number {
        var idx = this.nodes.findIndex((val) => (val.name === name));
        var node = this.nodes[idx]
        var conflict = 0
        for(let i = 0; i < node.neighbors.length; i++) {
            if(this.nodes[node.neighbors[i]].color === node.color) {
                conflict++
            }
        }
        return conflict
    }
}

const checkSolved = (graph: Graph): boolean => {
    for(let i = 0; i < graph.getSize(); i++) {
        if(graph.checkConflict(graph.nodes[i].name)) return false
    }
    return true
}

// Local search implementation with number of least conflicts
const leastConflicts = (graph: Graph, domain:string[], iterationLimit: number): boolean => {
    // Random state
    for(let i = 0; i < graph.getSize(); i++) {
        graph.nodes[i].color = domain[randomInt(0, domain.length-1)]
    }

    for(let i = 0; i < iterationLimit; i++) {
        if(checkSolved(graph)) {
            console.log("Num of iterations : " + i)
            return true
        }

        // Randomly selects a node and find color with least conflicts
        var minConflict = 999999
        var idx = randomInt(0, graph.getSize()-1)
        var minColorIdx = domain.findIndex((val) => (val === graph.nodes[idx].color))
        for(let j = 0; j < domain.length; j++) {
            graph.nodes[idx].color = domain[j]
            var conflict = graph.checkConflict(graph.nodes[idx].name)
            if(minConflict > conflict) {
                minColorIdx = j
                minConflict = conflict
            }
        }

        // Apply the color with least conflict for that node
        graph.nodes[idx].color = domain[minColorIdx]
    }

    return false
}




const graph = new Graph("Australia")

graph.addNode("WA")
graph.addNode("NT")
graph.addNode("Q")
graph.addNode("NSW")
graph.addNode("V")
graph.addNode("SA")
graph.addNode("T")

graph.addEdge("WA", "NT")
graph.addEdge("WA", "SA")
graph.addEdge("NT", "SA")
graph.addEdge("NT", "Q")
graph.addEdge("SA", "Q")
graph.addEdge("SA", "NSW")
graph.addEdge("SA", "V")
graph.addEdge("NSW", "Q")
graph.addEdge("NSW", "V")

if(leastConflicts(graph, ["red", "green", "blue"], 1000)) {
    console.log(graph)
} else {
    console.log("Did not found a solution (Either local minimum or impossible)")
}


