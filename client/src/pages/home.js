import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import FloatingIcons from "../components/FloatingIcons";
import { generateDeck } from "../utils/databaseRoutes";
import { FaSpinner } from "react-icons/fa";

export default function Home() {
    const navigate = useNavigate();
    const [studyText, setStudyText] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [cardCount, setCardCount] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const textareaRef = useRef(null);

    // Character count limits
    const MIN_CHARS = 300;
    const MAX_CHARS = 10000;
    const MIN_CARDS = 3;
    const MAX_CARDS = 50;

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setStudyText(newText);
        setCharCount(newText.length);
        
        // Clear error message when user deletes all text
        if (newText.length === 0) {
            setError('');
        }
    };

    const validateForm = () => {        
        if (charCount === 0) {
            setError("Please enter some study content");
            return false;
        }
        
        if (charCount < MIN_CHARS) {
            setError(`Text must contain at least ${MIN_CHARS} characters (currently ${charCount})`);
            return false;
        }
        
        if (charCount > MAX_CHARS) {
            setError(`Text exceeds the maximum of ${MAX_CHARS} characters (currently ${charCount})`);
            return false;
        }
        
        setError('');
        return true;
    };

    const handleGenerateFlashcards = async () => {
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const result = await generateDeck(
                cardCount,
                studyText
            );
            
            // Save the generated deck to localStorage
            const deckToSave = {
                ...result.deck,
                savedAt: new Date().toISOString()
            };
            
            localStorage.setItem('guestDeck', JSON.stringify(deckToSave));
            
            setSuccess('Flashcards generated successfully!');
            
            // Navigate to the guest study page after a brief delay to show success message
            setTimeout(() => {
                navigate('/study-deck-guest');
            }, 1000);
            
        } catch (err) {
            console.error('Error generating flashcards:', err);
            setError('Failed to generate flashcards. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const colorOptions = [
        { name: 'Red', value: 'red' },
        { name: 'Green', value: 'green' },
        { name: 'Blue', value: 'blue' },
        { name: 'Yellow', value: 'yellow' },
        { name: 'Purple', value: 'purple' },
    ];

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

    // Helper function to determine if error message should be displayed
    const shouldShowCharCountError = () => {
        // Only show error if some text has been entered but it's less than minimum or more than maximum
        return charCount > 0 && (charCount < MIN_CHARS || charCount > MAX_CHARS);
    };

    return (
        <div className="min-h-screen flex flex-col relative">
            <Navbar currentPage={"home"} />
            <FloatingIcons />
            <div className="max-w-3xl mx-auto px-4 py-12 mt-16 w-full flex-grow">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
                        Convert Text Into Study Flashcards
                    </h1>
                    <p className="text-lg text-gray-600">
                        Simply paste your study material below and let AI summarize it into flashcards for you.
                    </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                            {success}
                        </div>
                    )}
                    
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
                            <label className="block text-gray-700 text-sm font-bold" htmlFor="studyText">
                                Paste Your Study Content
                            </label>
                            <span className={`text-sm ${shouldShowCharCountError() ? 'text-red-500' : 'text-gray-500'}`}>
                                {charCount}/{MAX_CHARS} characters
                            </span>
                        </div>
                        <textarea
                            id="studyText"
                            ref={textareaRef}
                            className={`shadow appearance-none border rounded w-full p-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${shouldShowCharCountError() ? 'border-red-500' : ''}`}
                            rows="10"
                            placeholder={`Paste your notes, textbook content, or any study material here (minimum ${MIN_CHARS} characters)...`}
                            value={studyText}
                            onChange={handleTextChange}
                        />
                        
                        {/* Only show error messages when there's actually content entered */}
                        {charCount > 0 && charCount < MIN_CHARS && (
                            <p className="text-red-500 text-sm mt-2">
                                Minimum of {MIN_CHARS} characters required.
                            </p>
                        )}
                        
                        {charCount > MAX_CHARS && (
                            <p className="text-red-500 text-sm mt-2">
                                Maximum of {MAX_CHARS} characters allowed.
                            </p>
                        )}
                        
                        {/* Show informational message when count is valid and text is entered */}
                        {charCount >= MIN_CHARS && charCount <= MAX_CHARS && charCount > 0 && (
                            <p className="text-sm text-gray-500 mt-2">
                                Our AI will convert this text into {cardCount} flashcards.
                            </p>
                        )}
                    </div>
                    
                    <button
                        onClick={handleGenerateFlashcards}
                        disabled={loading || charCount === 0 || charCount < MIN_CHARS || charCount > MAX_CHARS}
                        className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                            loading || charCount === 0 || charCount < MIN_CHARS || charCount > MAX_CHARS
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-blue-700'
                        }`}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin mr-2" />
                                Generating Flashcards...
                            </>
                        ) : (
                            'Generate Flashcards'
                        )}
                    </button>
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>No account required. Try it out now!</p>
                </div>
            </div>
        </div>
    );
}