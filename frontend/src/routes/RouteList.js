import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import BoardGameFinderHome from "../common/BoardGameFinderHome";
import SignupForm from "../auth/SignupForm";
import LoginForm from "../auth/LoginForm";
import ProfileForm from "../users/ProfileForm";
import ProfileView from "../users/ProfileView"

import GameView from "../games/GameView";
import NoteCreate from "../notes/NoteCreate";
import NoteEdit from "../notes/NoteEdit";

import ListCreate from "../lists/ListCreate";
import ListEdit from "../lists/ListEdit";
import ListDetail from "../lists/ListDetail";

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
    routeComp.push(<Route key="game-view" path="/games/:bggId" element={<GameView />} />);

    routeComp.push(<Route key="note-create" path="/notes/create" element={<NoteCreate />} />);
    routeComp.push(<Route key="note-create" path="/notes/create/:bggId" element={<NoteCreate />} />);
    routeComp.push(<Route key="note-edit" path="/notes/:noteId/edit" element={<NoteEdit />} />);

    routeComp.push(<Route key="list-create" path="/lists/create" element={<ListCreate />} />);
    routeComp.push(<Route key="list-view" path="/lists/:listId" element={<ListDetail />} />);
    routeComp.push(<Route key="list-edit" path="/lists/:listId/edit" element={<ListEdit />} />);

    routeComp.push(<Route key="profile" path="/users/profile" element={<ProfileView />} />);
    routeComp.push(<Route key="profile-update" path="/user/profile/edit" element={<ProfileForm />} />);

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