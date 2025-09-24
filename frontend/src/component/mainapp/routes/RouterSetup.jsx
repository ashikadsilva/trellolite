import PrivateRoute from "../mainapp/PrivateRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function RouterSetup() {

    return(
        <Router>
            <Routes>
                <Route path = "/" element = {<App />} />
                <Route
                    path = "/admin"
                    element = {
                        <PrivateRoute allowedRoles={["admin"]}>
                            <AdminPage />
                        </PrivateRoute>
                    }
                    />
            </Routes>
        </Router>
    );
}
export default RouterSetup;