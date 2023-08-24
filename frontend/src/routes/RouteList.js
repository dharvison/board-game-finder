import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import BoardGameFinderHome from "../home/BoardGameFinderHome";
import SignupForm from "../auth/SignupForm";
import LoginForm from "../auth/LoginForm";
import ProfileForm from "../users/ProfileForm";
// import Jobs from "../jobs/Jobs";
// import Companies from "../companies/Companies";
// import CompanyDetail from "../companies/CompanyDetail";
import UserContext from "../auth/UserContext";

/**
 * Routes for App
 */
function RouteList({ signup, login }) {
    const { currentUser } = useContext(UserContext);

    const routeComp = [];
    if (currentUser.loaded) {
        // Logged in user can access protected routes
        // routeComp.push(<Route path="/companies/:handle" element={<CompanyDetail />} />);
        // routeComp.push(<Route path="/companies" element={<Companies />} />);
        // routeComp.push(<Route path="/jobs" element={<Jobs />} />);
        routeComp.push(<Route path="/profile" element={<ProfileForm />} />);
    } else {
        // Anon users can only access signup and login
        routeComp.push(<Route path="/signup" element={SignupForm({ signup })} />);
        routeComp.push(<Route path="/login" element={LoginForm({ login })} />);
    }

    return (
        <div>
            <Routes>
                <Route path="/" element={BoardGameFinderHome()} />

                {routeComp}

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    )
}

export default RouteList;