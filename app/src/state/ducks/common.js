export const ADD_ENTITIES = 'ADD_ENTITIES';
export const addEntities = entities => {
  return {
    type: ADD_ENTITIES,
    payload: entities,
  };
};

export const ADD_CONTRIBUTION_ENTITIES = 'ADD_CONTRIBUTION_ENTITIES';
export const addContributionEntities = entities => {
  return {
    type: ADD_CONTRIBUTION_ENTITIES,
    payload: entities,
  };
};

export const ADD_EXPENDITURE_ENTITIES = 'ADD_EXPENDITURE_ENTITIES';
export const addExpenditureEntities = entities => {
  return {
    type: ADD_EXPENDITURE_ENTITIES,
    payload: entities,
  };
};

export const RESET_STATE = 'RESET_STATE';
export const resetState = () => {
  return {
    type: RESET_STATE,
  };
};
