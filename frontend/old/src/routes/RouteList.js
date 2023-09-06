import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import BoardGameFinderHome from "../home/BoardGameFinderHome";
import SignupForm from "../auth/SignupForm";
import LoginForm from "../auth/LoginForm";
import ProfileForm from "../users/ProfileForm";
import ProfileView from "../users/ProfileView"
import UserContext from "../auth/UserContext";
import SearchResults from "../search/SearchResults";

/**
 * Routes for App
 */
function RouteList({ signup, login }) {
    const { currentUser, searchTerm } = useContext(UserContext);

    const routeComp = [];
    if (currentUser.loaded) {
        // Logged in user can access protected routes
        // routeComp.push(<Route path="/companies/:handle" element={<CompanyDetail />} />);
        routeComp.push(<Route key="profile" path="/profile" element={<ProfileView />} />);
        routeComp.push(<Route key="profile-update" path="/profile/update" element={<ProfileForm />} />);
        routeComp.push(<Route key="search" path="/search" element={SearchResults({ searchTerm })} />);
    } else {
        // Anon users can only access signup and login
        // routeComp.push(<Route path="/search" element={SearchResults({ searchTerm })} />);
        routeComp.push(<Route key="signup" path="/signup" element={SignupForm({ signup })} />);
        routeComp.push(<Route key="login" path="/login" element={LoginForm({ login })} />);
    }

    return (
        <div>
            <Routes>
                <Route key="home" path="/" element={BoardGameFinderHome()} />

                {routeComp}

                <Route key="catchall" path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    )
}

export default RouteList;