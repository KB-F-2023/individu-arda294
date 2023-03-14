type Vertex = [number, number]
type Vertices = Vertex[]

interface Path {
    path: number[],
    fit: number
}

const createPath = (verts: Vertices, size: number, p: number[] = []): Path => {
    if(p.length == 0) p = shuffledArray(size)
    return {
        path: p,
        fit: getTotalDistance(verts, p)
    }
}

const randomInt = (start: number, end: number): number => {
    return Math.floor(Math.random() * (end-start+1)) + start
}

const getDistance = (a: Vertex, b: Vertex): number => {
    let x = Math.abs(b[0] - a[0])
    let y = Math.abs(b[1] - a[1])
    return Math.floor(Math.sqrt(x*x + y*y))
}

const getTotalDistance = (verts: Vertices, path: number[]): number => {
    let result = 0
    for(let i = 0; i < path.length-1; i++) {
        result += getDistance(verts[path[i]], verts[path[i+1]])
    }
    return result
}

const randomVertices = (num: number = 10, size: number = 100): Vertices => {
    let verts: Vertices = []
    for(let i = 0; i < num; i++) verts.push([randomInt(0, size), randomInt(0, size)])
    return verts
}

const shuffledArray = (size: number): number[] => {
    let arr: number[] = []
    for(let i = 0; i < size; i++) {
        arr.push(i)
    }
    arr.sort((x) => randomInt(-10,10))
    arr.sort((x) => randomInt(-10,10))
    return arr
}

const crossOver = (verts: Vertices, a: number[], b: number[], mutation: number = 50): Path[] => {
    let newA: number[] = []
    let newB: number[] = []
    let start = randomInt(0, a.length-1)
    let l = randomInt(0, a.length-1)
    let end = (start + l > a.length-1) ? a.length-1 : start + l
    // Array slice
    let aSlice = a.slice(start,end+1)
    let bSlice = b.slice(start,end+1)
    // Elements not present in each other array slice
    let notASlice = b.filter((x) => !aSlice.includes(x))
    let notBSlice = a.filter((x) => !bSlice.includes(x))
    for(let i = 0; i < start; i++) {
        newA.push(notASlice[0])
        notASlice.shift()
        newB.push(notBSlice[0])
        notBSlice.shift()
    }
    // Insert the slice into each child
    newA.push(...aSlice)
    newB.push(...bSlice)
    for(let i = end+1; i < a.length; i++) {
        newA.push(notASlice[0])
        notASlice.shift()
        newB.push(notBSlice[0])
        notBSlice.shift()
    }
    // Swap mutation (50% Chance by default)
    let first: number
    let second: number
    if(randomInt(0, 100) > mutation) {
        first = randomInt(0, a.length-1)
        second = randomInt(0, a.length-1)
        var temp = newA[first]
        newA[first] = newA[second]
        newA[second] = temp
    }
    if(randomInt(0, 100) > mutation) {
        first = randomInt(0, a.length-1)
        second = randomInt(0, a.length-1)
        var temp = newB[first]
        newB[first] = newB[second]
        newB[second] = temp
    }
    return [createPath(verts, verts.length, newA), createPath(verts, verts.length, newB)]
}

const geneticAlgorithm = (verts: Vertices, pop_size: number, max_generation: number): Path => {
    let startPop: Path[] = []
    let newPop: Path[] = []
    let pathLength = verts.length
    // Generate initial population
    for(let i = 0; i < pop_size; i++) {
        startPop.push(createPath(verts, pathLength))
    }

    startPop.sort((a, b) => a.fit - b.fit)

    for(let i = 0; i < max_generation; i++) {
        
        for(let j = 0; newPop.length + 2 <= pop_size; j++) {
            newPop.push(...crossOver(verts, startPop[j].path, startPop[j+1].path, 50))
        }
        newPop.sort((a, b) => a.fit - b.fit)
        console.log(newPop)
        startPop = [...newPop]
        newPop = []
    }

    return startPop[0]
}

let vertices = randomVertices(20, 100)

console.log(geneticAlgorithm(vertices, 10, 10))




