import * as actionTypes from './lecturerCompleteProfileTypes';

const initialState = {
  loading: false,
};

// all the home page actions are handled here
function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LECTURER_EDIT_PROFILE:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.LECTURER_EDIT_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case actionTypes.LECTURER_EDIT_PROFILE_ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}

export default reducer;
