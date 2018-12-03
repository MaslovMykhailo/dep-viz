const changeDepTree = (node, condition1, condition2, withSize) => {
  return {
    name: node.name,
    size: withSize ? node[condition1][condition2] : undefined,
    condition: condition2,
    children: node.dependencies.map(depTree =>
      changeDepTree(depTree, condition1, condition2, true)
    )
  }
};

export default changeDepTree;