'use strict'

/**
 * Contains utils for string manipulation.
 *
 * @returns {object} - An object with utility functions for string manipulation.
 */
export function stringManipulation() {
  /**
   * Removes excessive whitespace from a class list string.
   *
   * @param {string} classList - The class list string to process.
   * @returns {string | void} - The class list string without excessive whitespace.
   */
  function removeWhitespace(classList) {
    const classListWithWhitespace = classList.split(/(\s+)/)
    const divider = ' '

    const classListNoWhitespace = classListWithWhitespace.filter(
      className => className.trim() !== '',
    ).join(divider)

    return classListNoWhitespace
  }

  return {
    removeWhitespace,
  }
}
