import {combineReducers, createStore} from 'redux'

//actions.js
export const setInfo = info => ({
    type: 'SET_INFO',
    info,
});
  
export const wipeInfo = () => ({
    type: 'WIPE_INFO',
});

//reducers.js : 
export const info = (state = {}, action) => {
    switch (action.type) {
        case 'SET_INFO':
            return action.info;
        case 'WIPE_INFO':
            return {};
        default:
            return state;
    }
};

export const reducers = combineReducers({
    info,
});

//store.js : 
export function configureStore(initialState = {}) {
    const store = createStore(reducers, initialState);
    return store;
};
  
export const store = configureStore();