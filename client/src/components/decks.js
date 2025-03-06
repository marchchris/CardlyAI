import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEdit, FaTrashAlt, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { getUserDecks, createDeck, deleteDeck } from '../utils/databaseRoutes';
import { FaSpinner } from "react-icons/fa";

import { BsThreeDotsVertical } from "react-icons/bs";
import Loading from './loadingScreen';

export default function Decks(props) {
    const user = props.user;
    const navigate = useNavigate();
    const [decks, setDecks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDeckTitle, setNewDeckTitle] = useState('');
    const [newDeckContent, setNewDeckContent] = useState('');
    const [cardCount, setCardCount] = useState(10);
    const [charCount, setCharCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingDecks, setLoadingDecks] = useState(true);
    const [errors, setErrors] = useState({});
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [deletingDeckId, setDeletingDeckId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingDeck, setDeletingDeck] = useState(false);

    // Change from word count to character count
    const MIN_CHARS = 300;
    const MAX_CHARS = 10000;
    const MIN_CARDS = 3;
    const MAX_CARDS = 30;

    const textareaRef = useRef(null);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch user's decks when component mounts or user changes
    useEffect(() => {
        const fetchDecks = async () => {
            if (user && user.uid) {
                setLoadingDecks(true);
                try {
                    const userDecks = await getUserDecks(user.uid);
                    setDecks(userDecks || []);
                } catch (error) {
                    console.error("Error fetching decks:", error);
                    // Optionally set an error state here
                } finally {
                    setLoadingDecks(false);
                }
            }
        };

        fetchDecks();
    }, [user]);

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
        if (!validateForm() || !user || !user.uid) {
            return;
        }

        setLoading(true);
        setErrors({ ...errors, submit: null });

        try {
            // Create the deck using our API with AI-generated flashcards
            const result = await createDeck(
                user.uid,
                newDeckTitle,
                selectedColor,
                cardCount,
                newDeckContent
            );

            // Add the new deck to the local state
            if (result && result.deck) {
                setDecks(prevDecks => [...prevDecks, result.deck]);
            }

            resetForm();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating deck:', error);
            setErrors({
                ...errors,
                submit: 'Failed to create flashcards. Please check your content and try again.'
            });
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

    const toggleDropdown = (deckId, e) => {
        e.stopPropagation();
        setOpenDropdownId(openDropdownId === deckId ? null : deckId);
    };

    const handleEditDeck = (deckId, e) => {
        e.stopPropagation();
        setOpenDropdownId(null);
        navigate(`/edit-deck/${deckId}`);
    };

    const handleDeleteDeck = (deckId, e) => {
        e.stopPropagation();
        setOpenDropdownId(null);
        // Open the delete confirmation modal instead of using window.confirm
        setDeletingDeckId(deckId);
        setShowDeleteModal(true);
    };

    const confirmDeleteDeck = async () => {
        if (!deletingDeckId) return;

        try {
            setDeletingDeck(true);
            // Call the API to delete the deck
            await deleteDeck(user.uid, deletingDeckId);
            
            // After successful deletion, update the decks state
            setDecks(decks.filter(deck => deck._id !== deletingDeckId));
            
            // Set success message (optional)
            setSuccess && setSuccess("Deck deleted successfully");
        } catch (error) {
            console.error("Error deleting deck:", error);
            // Set error message (optional)
            setError && setError("Failed to delete deck. Please try again.");
        } finally {
            // Close the modal and reset states
            setShowDeleteModal(false);
            setDeletingDeckId(null);
            setDeletingDeck(false);
        }
    };

    const cancelDeleteDeck = () => {
        setShowDeleteModal(false);
        setDeletingDeckId(null);
    };

    if (loadingDecks) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {loadingDecks ? (
                <div className="w-full flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : decks.length === 0 ? (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {decks.map((deck) => (
                        <div key={deck._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleStudyDeck(deck._id)}>
                            <div className="h-36 overflow-hidden bg-gray-200 py-2 flex items-center justify-center">
                                <div className="bg-white p-4 rounded-lg flex flex-col justify-center items-center text-center w-1/2 h-full">
                                    <p className="text-gray-600 text-sm">
                                        {deck.cards ? deck.cards[0].question : deck.content.split(' ').slice(0, 10).join(' ')}...
                                    </p>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="relative">
                                    <BsThreeDotsVertical
                                        className="text-gray-500 hover:text-black transition duration-200 text-xl float-right cursor-pointer"
                                        onClick={(e) => toggleDropdown(deck._id, e)}
                                    />

                                    {openDropdownId === deck._id && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1"
                                            style={{ top: '100%' }}
                                        >
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition duration-200"
                                                onClick={(e) => handleEditDeck(deck._id, e)}
                                            >
                                                <FaEdit className="mr-2" /> Edit
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center transition duration-200"
                                                onClick={(e) => handleDeleteDeck(deck._id, e)}
                                            >
                                                <FaTrashAlt className="mr-2" /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center mb-2">
                                    <div className={`h-4 w-4 rounded-full mr-2 ${getColorClass(deck.colour)}`}></div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{deck.title}</h3>
                                </div>
                                <p className="text-gray-600">
                                    {deck.cards ? deck.cards.length : deck.num_cards} {(deck.cards ? deck.cards.length : deck.num_cards) === 1 ? 'Card' : 'Cards'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Created: {new Date(deck.created_at).toLocaleDateString()}</p>
                                <button
                                    className="p-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full transition duration-300"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStudyDeck(deck._id);
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-center mb-4 text-red-600">
                                <FaExclamationTriangle className="h-12 w-12" />
                            </div>
                            <h3 className="text-xl font-bold text-center mb-2">Delete Deck</h3>
                            <p className="text-gray-600 text-center mb-6">
                                Are you sure you want to delete this deck? This action cannot be undone and all flashcards will be permanently lost.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={cancelDeleteDeck}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline duration-300"
                                    disabled={deletingDeck}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteDeck}
                                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center duration-300"
                                    disabled={deletingDeck}
                                >
                                    {deletingDeck ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <FaTrashAlt className="mr-2" /> Delete Deck
                                        </>
                                    )}
                                </button>
                            </div>
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
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.title ? 'border-red-500' : ''
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
                                            className={`w-8 h-8 rounded-full ${getColorClass(color.value)} ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-gray-500' : ''
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
                                    <span className={`text-sm ${charCount < MIN_CHARS || charCount > MAX_CHARS
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
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${charCount < MIN_CHARS || charCount > MAX_CHARS ? 'border-red-500' : ''
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
                                    className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline duration-300 font-medium"
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateDeck}
                                    className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center duration-300 ${charCount < MIN_CHARS || charCount > MAX_CHARS ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    type="button"
                                    disabled={loading || charCount < MIN_CHARS || charCount > MAX_CHARS}
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Generating AI Flashcards...
                                        </>
                                    ) : (
                                        'Create Flashcards'
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