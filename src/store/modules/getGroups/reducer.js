const getGroupsReducer = (state = false, actions) => {
  switch (actions.type) {
    case "@groups/GET":
      const { obj } = actions;
      return obj;

    default:
      return state;
  }
};

export default getGroupsReducer;
