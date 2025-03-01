import Navbar from "../components/navbar";
import Decks from "../components/decks";

export default function Dashboard() {
    return (
        <div className="min-h-screen">
            <Navbar currentPage={"dashboard"} />
            <div className="container mx-auto pt-20 px-4 flex justify-center">
                <Decks />
            </div>
        </div>
    );
}