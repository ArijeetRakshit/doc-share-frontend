import { createContext, useReducer } from "react";
import { SET_USER, CLEAR_USER } from "./UserActionTypes";
import userReducer from "./UserReducer";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const initalState = {
        userName: '',
        socket: ''
    };
    const [ state, dispatch ] = useReducer(userReducer,initalState);

    const setUser = (userName, socket ) => {
        dispatch({
            type: SET_USER,
            payload: {
                userName,
                socket
            }
        })
    };

    const clearUser = () => {
        dispatch({
            type: CLEAR_USER,
        })
    };

    return (
        <UserContext.Provider value = {{
            userInfo: state,
            setUser,
            clearUser
        }}>
            {children}
        </UserContext.Provider>
    )
};

export default UserContext;