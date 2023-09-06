import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import BoardGameFinderHome from "../common/BoardGameFinderHome";
import SignupForm from "../auth/SignupForm";
import LoginForm from "../auth/LoginForm";
import GameDetail from "../games/GameDetail";
import ListDetail from "../lists/ListDetail";
import ListForm from "../lists/ListForm";
import NoteForm from "../notes/NoteForm";
import NoteDetail from "../notes/NoteDetail";
import ProfileForm from "../users/ProfileForm";
// import ProfileView from "../users/ProfileView"
// import UserContext from "../auth/UserContext";
import SearchResults from "../search/SearchResults";
import TrendingGames from "../trending/trending";

/**
 * Routes for App
 */
function RouteList({ signup, login }) {
    // const { currentUser, searchTerm } = useContext(UserContext);

    const routeComp = [];
    // if (currentUser.loaded) {
        // Logged in user can access protected routes
        routeComp.push(<Route key="game-view" path="/games/:bggId" element={<GameDetail />} />);
        routeComp.push(<Route key="note-create" path="/user/notes/create" element={<NoteForm />} />);
        routeComp.push(<Route key="note-view" path="/user/notes/:noteId" element={<NoteDetail/>} />);
        routeComp.push(<Route key="list-create" path="/user/lists/create" element={<ListForm />} />);
        routeComp.push(<Route key="list-view" path="/user/lists/:listId" element={<ListDetail/>} />);

        // routeComp.push(<Route key="profile" path="/profile" element={<ProfileView />} />);
        routeComp.push(<Route key="profile-update" path="/user/profile" element={<ProfileForm />} />);
        
        routeComp.push(<Route key="search" path="/search" element={SearchResults()} />);
        routeComp.push(<Route key="trending" path="/trending" element={TrendingGames()} />);
    // } else {
        // Anon users can only access signup and login
        // routeComp.push(<Route path="/search" element={SearchResults({ searchTerm })} />);
        routeComp.push(<Route key="signup" path="/signup" element={SignupForm({ signup })} />);
        routeComp.push(<Route key="login" path="/login" element={LoginForm({ login })} />);
    // }

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