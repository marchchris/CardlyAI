import { useContext, useState } from "react";
import { AuthContext } from "../config/AuthProvider";
import Navbar from "../components/navbar";
import Decks from "../components/decks";
import Loading from "../components/loadingScreen";

export default function Dashboard() {
    const { loading, user} = useContext(AuthContext);

    if (loading) {
        return (
            <Loading />
        );
    }
    return (
        <div className="min-h-screen">
            <Navbar currentPage={"dashboard"} />
            <div className="container mx-auto pt-20 px-4 flex justify-center">
                <Decks user = {user}/>
            </div>
        </div>
    );
}