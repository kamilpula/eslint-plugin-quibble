'use strict'

/**
 * Contains utils for working with rules, i.e. rule metadata.
 *
 * @returns {object} - An object with utility functions for working with rules.
 */
export function ruleMetaData() {
  /**
   * Returns the URL for the rule documentation.
   * @author https://github.com/yannickcr/eslint-plugin-react/blob/master/lib/util/docsUrl.js
   *
   * @param {string} ruleName - The name of the rule matching the rule meta data.
   * @returns {string} - The URL for the rule documentation
   */
  function getDocsUrl(ruleName) {
    return `https://github.com/kamilpula/eslint-plugin-quibble/tree/main/docs/rules/${ruleName}.md`
  }

  return {
    getDocsUrl,
  }
}
