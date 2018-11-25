const changeDepTree = (tree, condition1, condition2, withSize) => {
  return {
    name: tree.name,
    size: withSize ? tree[condition1][condition2] : undefined,
    condition: condition2,
    children: tree.dependencies.map(depTree =>
      changeDepTree(depTree, condition1, condition2, true)
    )
  }
};

export default changeDepTree;