import React, {useContext} from "react";
import {Route, Redirect} from "react-router-dom";
import UserContext from "./UserContext";

const LoggedOutRoute = ({exact, path, children}) => {
    const {curUser} = useContext(UserContext);

    if (curUser !== null) return <Redirect to="/dashboard" />

    return (
        <Route exact={exact} path={path}>
            {children}
        </Route>
    )
}

export default LoggedOutRoute;