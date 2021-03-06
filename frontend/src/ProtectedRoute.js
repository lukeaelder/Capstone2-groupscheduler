import React, {useContext} from "react";
import {Route, Redirect} from "react-router-dom";
import UserContext from "./UserContext";

const ProtectedRoute = ({exact, path, children}) => {
    const {curUser} = useContext(UserContext);

    if (!curUser) return <Redirect to="/login"/>

    return (
        <Route exact={exact} path={path}>
            {children}
        </Route>
    )
}

export default ProtectedRoute;