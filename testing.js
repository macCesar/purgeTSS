const ArrayUtils = require('./ArrayUtils')

const miArray = [1, 2, 3]

// Forma original
ArrayUtils.append(miArray, 4, 5) // miArray es ahora [1, 2, 3, 4, 5]

// Nueva forma con un arreglo
const arregloParaAgregar = [6, 7]
ArrayUtils.append(miArray, arregloParaAgregar) // miArray es ahora [1, 2, 3, 4, 5, 6, 7]

ArrayUtils.before(miArray, 0) // miArray es ahora [0, 1, 2, 3, 4, 5, 6, 7]
ArrayUtils.remove(miArray, 3) // miArray es ahora [0, 1, 2, 4, 5, 6, 7]
ArrayUtils.after(miArray, 2, 3) // miArray es ahora [0, 1, 2, 3, 4, 5, 6, 7]

console.log(ArrayUtils.last(miArray)) // Imprime: 7
console.log(ArrayUtils.first(miArray)) // Imprime: 0

// Usando before con un array
const elementosParaAgregar = [-2, -1]
ArrayUtils.before(miArray, elementosParaAgregar) // miArray es ahora [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]

// Usando after con un array
const elementosParaInsertar = [3.5, 3.75]
ArrayUtils.after(miArray, 3, elementosParaInsertar) // miArray es ahora [-2, -1, 0, 1, 2, 3, 3.5, 3.75, 4, 5, 6, 7]
