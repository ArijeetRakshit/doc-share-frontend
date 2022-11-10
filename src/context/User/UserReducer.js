import  { CLEAR_USER, SET_USER } from "./UserActionTypes";

const userReducer = (state,action) => {
    switch (action.type){
        case SET_USER :
            return {
                userName: action.payload.userName,
                socket: action.payload.socket
            }
        case CLEAR_USER :
            return {
                userName: '',
                socket: ''
            }
        default:
            return state;
    }
};

export default userReducer;