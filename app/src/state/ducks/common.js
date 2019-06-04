export const ADD_ENTITIES = "ADD_ENTITIES";
export const addEntities = entities => {
  return {
    type: ADD_ENTITIES,
    payload: entities
  };
};
