export const ADD_ENTITIES = 'ADD_ENTITIES';
export const addEntities = entities => {
  return {
    type: ADD_ENTITIES,
    payload: entities,
  };
};

export const ADD_ENTITIES_LIST = 'ADD_ENTITIES';
export const addEntitiesList = entities => {
  return {
    type: ADD_ENTITIES,
    payload: entities,
  };
};
