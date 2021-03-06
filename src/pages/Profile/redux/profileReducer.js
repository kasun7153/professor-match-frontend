import * as actionTypes from './profileTypes';

const initialState = {
  loading: false,
  user: {},
  details: { recruitingDepartment: [] },
};

// all the home page actions are handled here
function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_PROFILE:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_PROFILE_SUCCESS:
      return {
        ...state,
        ...action.data,
        loading: false,
      };
    case actionTypes.GET_PROFILE_ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}

export default reducer;
