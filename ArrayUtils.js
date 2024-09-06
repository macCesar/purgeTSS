const ArrayUtils = {
  /**
   * Añade elementos al final del array.
   * @param {Array} arr - El array original.
   * @param {...*} elements - Elementos a añadir.
   * @returns {Array} El array modificado.
   */
  append: function(array, ...elements) {
    if (Array.isArray(elements[0])) {
      array.push(...elements[0])
    } else {
      array.push(...elements)
    }
    return array
  },

  /**
   * Añade elementos al principio del array.
   * @param {Array} arr - El array original.
   * @param {...*} elements - Elementos a añadir.
   * @returns {Array} El array modificado.
   */
  before(arr, ...elements) {
    if (Array.isArray(elements[0])) {
      arr.unshift(...elements[0])
    } else {
      arr.unshift(...elements)
    }
    return arr
  },

  /**
   * Elimina la primera ocurrencia del elemento especificado.
   * @param {Array} arr - El array original.
   * @param {*} element - Elemento a eliminar.
   * @returns {Array} El array modificado.
   */
  remove(arr, element) {
    const index = arr.indexOf(element)
    if (index > -1) {
      arr.splice(index, 1)
    }
    return arr
  },

  /**
   * Inserta elementos después del índice especificado.
   * @param {Array} arr - El array original.
   * @param {number} index - Índice después del cual insertar.
   * @param {...*} elements - Elementos a insertar.
   * @returns {Array} El array modificado.
   */
  after(arr, index, ...elements) {
    if (Array.isArray(elements[0])) {
      arr.splice(index + 1, 0, ...elements[0])
    } else {
      arr.splice(index + 1, 0, ...elements)
    }
    return arr
  },

  /**
   * Obtiene el último elemento sin modificar el array.
   * @param {Array} arr - El array.
   * @returns {*} El último elemento del array.
   */
  last(arr) {
    return arr[arr.length - 1]
  },

  /**
   * Obtiene el primer elemento sin modificar el array.
   * @param {Array} arr - El array.
   * @returns {*} El primer elemento del array.
   */
  first(arr) {
    return arr[0]
  }
}

// Exportamos la librería
module.exports = ArrayUtils
