import Navbar from "../components/navbar";
import FloatingIcons from "../components/FloatingIcons";

export default function Home() {
    const handleUpload = () => {
        const text = document.getElementById('study-text').value;
        // TODO: Implement the upload logic
    };

    return (
        <div className="min-h-screen flex items-center relative">
            <Navbar currentPage = {"home"}/>
            <FloatingIcons />
            <div className="max-w-3xl mx-auto px-4 py-12 mt-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-black mb-4">
                        Convert Text Into Study Flashcards
                    </h1>
                    <p className="text-lg text-gray-600">
                        Simply paste your study material below and let AI summarise it into flashcards for you.
                    </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                    <textarea
                        id="study-text"
                        className="w-full h-40 p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Paste your text here..."
                    />
                    <button
                        onClick={handleUpload}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Generate Flashcards
                    </button>
                </div>
            </div>
        </div>
    );
}