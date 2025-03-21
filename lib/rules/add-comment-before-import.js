import { ruleMetaData, templateProcessor } from '../utils/index.js'

const { defineTemplateBodyVisitor } = templateProcessor()
const { getDocsUrl } = ruleMetaData()

export default {
  meta: {
    name: 'add-comment-before-import',
    type: 'layout',
    fixable: 'code',
    docs: {
      description: 'Add comments before imports.',
      recommended: true,
      category: 'Stylistic Issues',
      url: getDocsUrl('add-comment-before-import'),
    },
    messages: {
      'add-comment-before-import': 'Comments should be added before import statements.',
      'group-imports': 'Imports should be grouped by type.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          importConfig: {},
        },
      },
    ],
  },

  create(context) {
    // Parse options
    const options = context.options[0]

    const DEFAULT_IMPORT_CONFIG = [
      {
        name: 'enum',
        comment: 'Enums',
        regex: 'enum',
      },
      {
        name: 'component',
        comment: 'Components',
        regex: 'component',
      },
      {
        name: 'utils',
        comment: 'Utils',
        regex: 'utils',
      },
      {
        name: 'filter',
        comment: 'Filters',
        regex: 'filter',
      },
      {
        name: 'service',
        comment: 'Services',
        regex: 'service',
      },
      {
        name: 'store',
        comment: 'Stores',
        regex: 'store',
      },
      {
        name: 'plugin',
        comment: 'Plugins',
        regex: 'plugin',
      },
    ]

    const importConfig = options && options.importConfig ? options.importConfig : DEFAULT_IMPORT_CONFIG

    const importNodes = []
    const groupedNodes = {}

    const sourceCode = context.sourceCode
    const allImportNodes = sourceCode.ast.body.filter(node => node.type === 'ImportDeclaration')

    function importDeclarationVisitor(node) {
      importNodes.push(node)

      const value = node.source.value
      const matchingType = importConfig.find(config => new RegExp(config.regex).test(value))

      if (!matchingType)
        return

      groupedNodes[matchingType.name] = groupedNodes[matchingType.name] || { nodes: [], comment: matchingType.comment }
      groupedNodes[matchingType.name].nodes.push(node)

      if (importNodes.length === allImportNodes.length) {
        const firstImportNode = importNodes[0]
        const lastImportNode = importNodes[importNodes.length - 1]

        function getGroupedNodesText() {
          return Object.keys(groupedNodes).map((key) => {
            const group = groupedNodes[key]
            // Add the group comment at the beginning of each group
            const groupText = `// ${group.comment}\n${
              group.nodes.map(node => sourceCode.getText(node)).join('\n')}`
            return groupText
          }).join('\n\n') // Add two newlines between groups
        }

        const text = getGroupedNodesText()

        // Find the actual start position, accounting for comments before the first import
        let startPos = firstImportNode.range[0]
        const commentsBefore = sourceCode.getCommentsBefore(firstImportNode)

        if (commentsBefore.length > 0) {
          // Find the start of the first comment
          startPos = commentsBefore[0].range[0]
        }

        // Group imports by type
        context.report({
          node: firstImportNode,
          messageId: 'group-imports',
          *fix(fixer) {
            yield fixer.replaceTextRange(
              [startPos, lastImportNode.range[1]],
              text,
            )
          },
        })
      }
    }

    const scriptVisitor = {
      ImportDeclaration: importDeclarationVisitor,
    }

    return defineTemplateBodyVisitor(context, {}, scriptVisitor)
  },
}
