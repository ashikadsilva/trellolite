import { useContext } from "react"
import { AuthContext } from "../component/context/AuthProvider"
import { Navigate } from "react-router-dom";


const PrivateRoute = ({ children, allowedRoles = [] }) => {

    const { authenticated, user } = useContext(AuthContext);

    if(!authenticated)
        return <Navigate to = "/login" replace />;
    
    // if allowedRoles is empty, allow all authenticated users
    if(allowedRoles.length === 0)
        return children; 

    const hasRole = user?.roles?.some(role => allowedRoles.includes(role));
    if(!hasRole)
        return <h2>Access Denied</h2>
    return children;
}

export default PrivateRoute 