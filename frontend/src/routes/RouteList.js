import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserContext from "../auth/UserContext";

import BoardGameFinderHome from "../common/BoardGameFinderHome";
import SignupForm from "../auth/SignupForm";
import LoginForm from "../auth/LoginForm";
import ProfileForm from "../users/ProfileForm";
import ProfileView from "../users/ProfileView"
import ProfilePublic from "../users/ProfilePublic";

import GameView from "../games/GameView";
import NoteCreate from "../notes/NoteCreate";
import NoteEdit from "../notes/NoteEdit";

import ListCreate from "../lists/ListCreate";
import ListEdit from "../lists/ListEdit";
import ListView from "../lists/ListView";
import ListAdd from "../lists/ListAdd";

import SearchResults from "../search/SearchResults";
import TrendingGames from "../trending/trending";

import MessageSend from "../messages/MessageSend";
import MessageView from "../messages/MessageView";
import Inbox from "../messages/Inbox";
import FindPlayers from "../users/FindPlayers";

/**
 * Routes for App
 */
function RouteList({ signup, login }) {
    const { currentUser } = useContext(UserContext);

    const routeComp = [];
    if (currentUser.loaded) {
        // Logged in user can access protected routes
        routeComp.push(<Route key="game-view" path="/games/:bggId" element={<GameView />} />);

        routeComp.push(<Route key="note-create" path="/notes/create" element={<NoteCreate />} />);
        routeComp.push(<Route key="note-create" path="/notes/create/:bggId" element={<NoteCreate />} />);
        routeComp.push(<Route key="note-edit" path="/notes/:noteId/edit" element={<NoteEdit />} />);

        routeComp.push(<Route key="list-create" path="/lists/create" element={<ListCreate />} />);
        routeComp.push(<Route key="list-view" path="/lists/:listId" element={<ListView />} />);
        routeComp.push(<Route key="list-edit" path="/lists/:listId/edit" element={<ListEdit />} />);
        routeComp.push(<Route key="list-add" path="/lists/:listId/add" element={<ListAdd />} />);

        routeComp.push(<Route key="profile" path="/users/profile" element={<ProfileView />} />);
        routeComp.push(<Route key="profile-public" path="/users/:userId" element={<ProfilePublic />} />);
        routeComp.push(<Route key="profile-update" path="/users/profile/edit" element={<ProfileForm />} />);

        routeComp.push(<Route key="inbox" path="/inbox" element={<Inbox />} />);

        routeComp.push(<Route key="msg-send" path="/msg/send" element={<MessageSend />} />);
        routeComp.push(<Route key="msg-view" path="/msg/:msgId" element={<MessageView />} />);

        routeComp.push(<Route key="search" path="/search" element={<SearchResults />} />);
        routeComp.push(<Route key="trending" path="/trending" element={<TrendingGames />} />);
        routeComp.push(<Route key="players" path="/players" element={<FindPlayers />} />);
    } else {
        // Anon users can only access trending, search, signup and login
        routeComp.push(<Route key="trending" path="/trending" element={<TrendingGames />} />);
        routeComp.push(<Route key="search" path="/search" element={<SearchResults />} />);
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