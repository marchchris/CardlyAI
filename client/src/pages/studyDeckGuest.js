import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Flashcard from '../components/flashcard';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Loading from '../components/loadingScreen';

export default function StudyDeckGuest() {
    const navigate = useNavigate();

    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ref to the Flashcard component to control flip state
    const flashcardRef = useRef();

    useEffect(() => {
        const fetchDeckFromStorage = () => {
            try {
                // Fetch deck from local storage
                const storedDeck = localStorage.getItem('guestDeck');
                
                if (!storedDeck) {
                    setError("No deck found. Please generate flashcards first.");
                    setLoading(false);
                    return;
                }
                
                const parsedDeck = JSON.parse(storedDeck);
                
                // Check if deck has cards
                if (!parsedDeck.cards || parsedDeck.cards.length === 0) {
                    setError("The generated deck doesn't contain any cards.");
                    setLoading(false);
                    return;
                }
                
                setDeck(parsedDeck);
                setCards(parsedDeck.cards);
                setLoading(false);
                
            } catch (error) {
                console.error("Error retrieving deck data:", error);
                setError("Failed to load deck. The deck data may be corrupted.");
                setLoading(false);
            }
        };

        fetchDeckFromStorage();
    }, []);

    const handlePrevCard = () => {
        // Reset flip state first
        setIsFlipped(false);
        // Then change card
        setCurrentCardIndex(prevIndex => {
            if (prevIndex > 0) return prevIndex - 1;
            return cards.length - 1; // Loop back to the last card
        });
    };

    const handleNextCard = () => {
        // Reset flip state first
        setIsFlipped(false);
        // Then change card
        setCurrentCardIndex(prevIndex => {
            if (prevIndex < cards.length - 1) return prevIndex + 1;
            return 0; // Loop back to the first card
        });
    };

    const handleFlip = (flipped) => {
        // Update the flipped state when the card is flipped
        setIsFlipped(flipped);
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleStartOver = () => {
        // Clear the stored deck and go back to home page
        localStorage.removeItem('guestDeck');
        navigate('/');
    };

    const getColorClass = (color) => {
        switch (color) {
            case 'red': return 'bg-red-500';
            case 'green': return 'bg-green-500';
            case 'blue': return 'bg-blue-500';
            case 'yellow': return 'bg-yellow-500';
            case 'purple': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="min-h-screen">
                <Navbar currentPage="study" />
                <div className="container mx-auto pt-24 px-4 pb-12">
                    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="text-gray-700 mb-6">{error}</p>
                        <button
                            onClick={handleBackToHome}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar currentPage="study" />

            <div className="container mx-auto pt-24 px-4 pb-12">
                <div className="max-w-2xl mx-auto">
                    {deck && (
                        <div className="flex items-center mb-8">
                            <div className={`h-6 w-6 rounded-full mr-3 ${getColorClass(deck.colour)}`}></div>
                            <h1 className="text-3xl font-bold text-gray-800">{deck.title}</h1>
                        </div>
                    )}
                    
                    {cards.length > 0 ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-500">
                                    Card {currentCardIndex + 1} of {cards.length}
                                </span>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={handleStartOver}
                                        className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                                    >
                                        Start Over
                                    </button>
                                    <button
                                        onClick={handleBackToHome}
                                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300"
                                    >
                                        <FaArrowLeft className="mr-2" /> Back to Home
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={handlePrevCard}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 z-10 duration-300"
                                    aria-label="Previous card"
                                >
                                    <FaArrowLeft className="text-gray-600" />
                                </button>

                                <Flashcard
                                    ref={flashcardRef}
                                    question={cards[currentCardIndex].question}
                                    answer={cards[currentCardIndex].answer}
                                    onFlip={handleFlip}
                                    key={currentCardIndex} // This forces a new instance when the index changes
                                />

                                <button
                                    onClick={handleNextCard}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 z-10 duration-300"
                                    aria-label="Next card"
                                >
                                    <FaArrowRight className="text-gray-600" />
                                </button>
                            </div>

                            <div className="flex justify-center mt-8">
                                {cards.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`h-2 w-2 mx-1 rounded-full ${currentCardIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    ></div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg">
                                This deck doesn't have any cards yet.
                            </p>
                            <button
                                onClick={handleBackToHome}
                                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                            >
                                Back to Home
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
