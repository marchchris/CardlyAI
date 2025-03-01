import { useState, useEffect, useRef } from 'react';
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function Decks() {
    const navigate = useNavigate();
    const [decks, setDecks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDeckTitle, setNewDeckTitle] = useState('');
    const [newDeckContent, setNewDeckContent] = useState('');
    const [cardCount, setCardCount] = useState(10);
    const [charCount, setCharCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Change from word count to character count
    const MIN_CHARS = 300;
    const MAX_CHARS = 10000;
    const MIN_CARDS = 3;
    const MAX_CARDS = 50;

    const textareaRef = useRef(null);

    useEffect(() => {
        const sampleDecks = [
            // Comment out to test empty state

            // { 
            //     id: 1, 
            //     title: 'Biology 101', 
            //     cardCount: 24, 
            //     color: 'green', 
            //     previewImage: 'https://via.placeholder.com/300x200?text=Biology' 
            // },
            // { 
            //     id: 2, 
            //     title: 'History Notes', 
            //     cardCount: 15, 
            //     color: 'blue', 
            //     previewImage: 'https://via.placeholder.com/300x200?text=History' 
            // },

        ];

        setDecks(sampleDecks);
    }, []);

    const colorOptions = [
        { name: 'Red', value: 'red' },
        { name: 'Green', value: 'green' },
        { name: 'Blue', value: 'blue' },
        { name: 'Yellow', value: 'yellow' },
        { name: 'Purple', value: 'purple' },
    ];

    const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);

    // Remove word count calculation and replace with character count
    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setNewDeckContent(newContent);
        setCharCount(newContent.length);
    };

    const validateForm = () => {
        const newErrors = {};

        // Title validation
        if (!newDeckTitle.trim()) {
            newErrors.title = 'Title is required';
        }

        // Content validation - now using character count
        if (charCount < MIN_CHARS) {
            newErrors.content = `Text must contain at least ${MIN_CHARS} characters (currently ${charCount})`;
        } else if (charCount > MAX_CHARS) {
            newErrors.content = `Text exceeds the maximum of ${MAX_CHARS} characters`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateDeck = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // In a real app, you would send this to an API
            // const response = await fetch('/api/decks/create', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ 
            //         title: newDeckTitle, 
            //         content: newDeckContent, 
            //         color: selectedColor,
            //         cardCount: cardCount
            //     })
            // });

            // if (!response.ok) throw new Error('Failed to create deck');
            // const data = await response.json();

            // Simulate API response
            const newDeck = {
                id: decks.length + 1,
                title: newDeckTitle,
                cardCount: cardCount, // Now using the user-specified card count
                color: selectedColor,
                previewImage: `https://via.placeholder.com/300x200?text=${encodeURIComponent(newDeckTitle)}`
            };

            setDecks([...decks, newDeck]);
            resetForm();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating deck:', error);
            setErrors({ ...errors, submit: 'Failed to create deck. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setNewDeckTitle('');
        setNewDeckContent('');
        setCardCount(10);
        setCharCount(0); // Reset character count instead of word count
        setErrors({});
    };

    const handleModalOpen = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleStudyDeck = (deckId) => {
        navigate(`/study/${deckId}`);
    };

    function getColorClass(color) {
        switch (color) {
            case 'red': return 'bg-red-500';
            case 'green': return 'bg-green-500';
            case 'blue': return 'bg-blue-500';
            case 'yellow': return 'bg-yellow-500';
            case 'purple': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    }

    // Add a function to get the error message for character count
    const getCharCountErrorMessage = () => {
        if (charCount < MIN_CHARS) {
            return `Minimum of ${MIN_CHARS} characters required.`;
        }
        if (charCount > MAX_CHARS) {
            return `Maximum of ${MAX_CHARS} characters allowed.`;
        }
        return null;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {decks.length === 0 ? (
                <div className="w-full flex items-center justify-center">
                    <div className="bg-white shadow-md rounded-lg p-8 text-center w-1/2">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">You have no decks</h2>
                        <p className="text-gray-600 mb-6">Create your first deck to start studying with AI-generated flashcards!</p>
                        <button
                            onClick={handleModalOpen}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center mx-auto duration-300"
                        >
                            <FaPlus className="h-5 w-5 mr-2" />
                            Create Your First Deck
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {decks.map((deck) => (
                        <div key={deck.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleStudyDeck(deck.id)}>
                            <div className="h-36 overflow-hidden">
                                <img
                                    src={deck.previewImage}
                                    alt={deck.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex items-center mb-2">
                                    <div className={`h-4 w-4 rounded-full mr-2 ${getColorClass(deck.color)}`}></div>
                                    <h3 className="text-xl font-semibold text-gray-800">{deck.title}</h3>
                                </div>
                                <p className="text-gray-600">{deck.cardCount} {deck.cardCount === 1 ? 'card' : 'cards'}</p>
                                <button
                                    className="p-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full transition duration-300"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStudyDeck(deck.id);
                                    }}
                                >
                                    Study Now
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Create New Deck Card */}
                    <div
                        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-dashed border-gray-300 flex flex-col items-center justify-center h-full min-h-[240px] transition duration-300"
                        onClick={handleModalOpen}
                    >
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="bg-blue-100 rounded-full p-4 mb-4">
                                <FaPlus className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Create New Deck</h3>
                            <p className="text-gray-500 text-sm">Add more flashcards to study</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Deck Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Create New Deck</h2>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            {errors.submit && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                    {errors.submit}
                                </div>
                            )}
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deckTitle">
                                    Deck Title
                                </label>
                                <input
                                    id="deckTitle"
                                    type="text"
                                    value={newDeckTitle}
                                    onChange={(e) => setNewDeckTitle(e.target.value)}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.title ? 'border-red-500' : ''
                                    }`}
                                    placeholder="e.g., Biology 101"
                                    required
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs italic mt-1">{errors.title}</p>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deckColor">
                                    Deck Color
                                </label>
                                <div className="flex space-x-2">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => setSelectedColor(color.value)}
                                            className={`w-8 h-8 rounded-full ${getColorClass(color.value)} ${
                                                selectedColor === color.value ? 'ring-2 ring-offset-2 ring-gray-500' : ''
                                            }`}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardCount">
                                    Number of Cards to Create: <span className="font-normal">{cardCount}</span>
                                </label>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">{MIN_CARDS}</span>
                                    <input
                                        id="cardCount"
                                        type="range"
                                        min={MIN_CARDS}
                                        max={MAX_CARDS}
                                        value={cardCount}
                                        onChange={(e) => setCardCount(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-500">{MAX_CARDS}</span>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-gray-700 text-sm font-bold" htmlFor="deckContent">
                                        Paste Your Study Content
                                    </label>
                                    <span className={`text-sm ${
                                        charCount < MIN_CHARS || charCount > MAX_CHARS
                                            ? 'text-red-500' 
                                            : 'text-gray-500'
                                    }`}>
                                        {charCount}/{MAX_CHARS} characters
                                    </span>
                                </div>
                                <textarea
                                    id="deckContent"
                                    ref={textareaRef}
                                    value={newDeckContent}
                                    onChange={handleContentChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        charCount < MIN_CHARS || charCount > MAX_CHARS ? 'border-red-500' : ''
                                    }`}
                                    rows="10"
                                    placeholder={`Paste your notes, textbook content, or any study material here (minimum ${MIN_CHARS} characters)...`}
                                    required
                                />
                                
                                {/* Display character count error message */}
                                {(charCount < MIN_CHARS || charCount > MAX_CHARS) && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">
                                        {getCharCountErrorMessage()}
                                    </p>
                                )}
                                
                                {/* Only show this message when there's no error */}
                                {!(charCount < MIN_CHARS || charCount > MAX_CHARS) && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Our AI will convert this text into {cardCount} flashcards for your study deck.
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline duration-300"
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateDeck}
                                    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center duration-300 ${
                                        charCount < MIN_CHARS || charCount > MAX_CHARS ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    type="button"
                                    disabled={loading || charCount < MIN_CHARS || charCount > MAX_CHARS}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        'Create Deck'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}