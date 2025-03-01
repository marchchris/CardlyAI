import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Flashcard from '../components/flashcard';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Loading from '../components/loadingScreen';

export default function StudyDeck() {
    const { deckId } = useParams();
    const navigate = useNavigate();

    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, fetch the deck and cards from an API
        const fetchDeckAndCards = async () => {
            try {
                // Simulating API call
                setTimeout(() => {
                    // Sample data
                    const sampleDeck = {
                        id: parseInt(deckId),
                        title: `Deck ${deckId}`,
                        color: ['red', 'green', 'blue', 'purple', 'yellow'][parseInt(deckId) % 5],
                    };

                    const sampleCards = [
                        { id: 1, question: "What is the capital of France?", answer: "Paris" },
                        { id: 2, question: "What is the powerhouse of the cell?", answer: "Mitochondria" },
                        { id: 3, question: "What is the chemical symbol for water?", answer: "H₂O" },
                        { id: 4, question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare" },
                        { id: 5, question: "What is the largest planet in our solar system?", answer: "Jupiter" }
                    ];

                    setDeck(sampleDeck);
                    setCards(sampleCards);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching deck data:", error);
                setLoading(false);
            }
        };

        fetchDeckAndCards();
    }, [deckId]);

    const handlePrevCard = () => {
        setCurrentCardIndex(prevIndex => {
            if (prevIndex > 0) return prevIndex - 1;
            return cards.length - 1; // Loop back to the last card
        });
    };

    const handleNextCard = () => {
        setCurrentCardIndex(prevIndex => {
            if (prevIndex < cards.length - 1) return prevIndex + 1;
            return 0; // Loop back to the first card
        });
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
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

    return (
        <div className="min-h-screen">
            <Navbar currentPage="study" />

            <div className="container mx-auto pt-24 px-4 pb-12">


                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center mb-8">


                        {deck && (
                            <div className="flex items-center">
                                <div className={`h-4 w-4 rounded-full mr-2 ${getColorClass(deck.color)}`}></div>
                                <h1 className="text-2xl font-bold">{deck.title}</h1>
                            </div>
                        )}
                    </div>
                    {cards.length > 0 ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-500">
                                    Card {currentCardIndex + 1} of {cards.length}
                                </span>
                                <button
                                    onClick={handleBackToDashboard}
                                    className="mr-4 flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300"
                                >
                                    <FaArrowLeft className="mr-2" /> Back to Deck List
                                </button>
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
                                    question={cards[currentCardIndex].question}
                                    answer={cards[currentCardIndex].answer}
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
                                        className={`h-2 w-2 mx-1 rounded-full ${currentCardIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}
                                    ></div>
                                ))}
                            </div>

                        </>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg">
                                This deck doesn't have any cards yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
