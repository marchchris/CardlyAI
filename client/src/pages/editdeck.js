import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";
import { getDeckById, editCard, deleteCard, addCard } from '../utils/databaseRoutes';
import { FaPlus, FaEdit, FaTrashAlt, FaSave, FaTimes, FaCheck, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from 'react-icons/fa';

import { AuthContext } from "../config/AuthProvider";
import Loading from '../components/loadingScreen';

export default function EditDeck() {
    const { user } = useContext(AuthContext);
    const { deckID } = useParams();
    const navigate = useNavigate();
    const [deck, setDeck] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [cardBeingEdited, setCardBeingEdited] = useState(null);
    const [originalCardData, setOriginalCardData] = useState(null);
    const [addingNewCard, setAddingNewCard] = useState(false);
    const [newCardData, setNewCardData] = useState({ question: '', answer: '' });
    const [savingChanges, setSavingChanges] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [deletingCardIndex, setDeletingCardIndex] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingCard, setDeletingCard] = useState(false);

    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch the deck when component mounts
    useEffect(() => {
        const fetchDeck = async () => {
            if (!user) return;

            setLoading(true);
            try {
                const deckData = await getDeckById(user.uid, deckID);
                setDeck(deckData);
                setError(null);
            } catch (err) {
                console.error("Error fetching deck:", err);
                setError("Failed to load deck. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchDeck();
    }, [deckID, user]);

    const toggleDropdown = (index, e) => {
        e.stopPropagation();
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const handleEditClick = (index, e) => {
        if (e) e.stopPropagation();
        setActiveDropdown(null);

        const originalCard = deck.cards[index];
        setOriginalCardData({
            question: originalCard.question,
            answer: originalCard.answer
        });

        setCardBeingEdited({
            index,
            question: originalCard.question,
            answer: originalCard.answer
        });
        setAddingNewCard(false);
    };

    const handleDeleteClick = (index, e) => {
        if (e) e.stopPropagation();
        setActiveDropdown(null);

        // Instead of showing window.confirm, set up the modal
        setDeletingCardIndex(index);
        setShowDeleteModal(true);
    };

    const confirmDeleteCard = async () => {
        if (deletingCardIndex === null) return;

        try {
            setDeletingCard(true);
            await deleteCard(user.uid, deckID, deletingCardIndex);

            // Update local state by removing card
            const updatedCards = deck.cards.filter((_, i) => i !== deletingCardIndex);
            setDeck({ ...deck, cards: updatedCards, num_cards: updatedCards.length });
            setSuccess("Card deleted successfully");
            setError(null);
        } catch (err) {
            console.error("Error deleting card:", err);
            setError("Failed to delete card. Please try again.");
            setSuccess(null);
        } finally {
            // Close the modal and reset
            setShowDeleteModal(false);
            setDeletingCardIndex(null);
            setDeletingCard(false);
        }
    };

    const cancelDeleteCard = () => {
        setShowDeleteModal(false);
        setDeletingCardIndex(null);
    };

    const handleCancelEdit = () => {
        setCardBeingEdited(null);
        setOriginalCardData(null);
        setSuccess(null);
        setError(null);
    };

    // Check if the card has actually been modified
    const isCardModified = () => {
        if (!cardBeingEdited || !originalCardData) return false;

        return cardBeingEdited.question.trim() !== originalCardData.question.trim() ||
            cardBeingEdited.answer.trim() !== originalCardData.answer.trim();
    };

    const handleSaveEdit = async () => {
        if (!cardBeingEdited) return;

        // Check if the card has been modified
        if (!isCardModified()) {
            setError("No changes were made to the card");
            return;
        }

        try {
            // Update local state with edited card
            const updatedCards = [...deck.cards];
            updatedCards[cardBeingEdited.index] = {
                question: cardBeingEdited.question,
                answer: cardBeingEdited.answer
            };

            setDeck({ ...deck, cards: updatedCards });
            setSuccess("Card updated successfully");
            setError(null);
            setCardBeingEdited(null);
            setOriginalCardData(null);
        } catch (err) {
            console.error("Error updating card:", err);
            setError("Failed to update card. Please try again.");
            setSuccess(null);
        }
    };

    const handleAddCardClick = () => {
        setAddingNewCard(true);
        setNewCardData({ question: '', answer: '' });
        setCardBeingEdited(null);
    };

    const handleSaveNewCard = async () => {
        if (!newCardData.question.trim() || !newCardData.answer.trim()) {
            setError("Both question and answer are required");
            return;
        }

        try {
            // Update local state with new card at the TOP of the list
            const updatedCards = [
                {
                    question: newCardData.question,
                    answer: newCardData.answer
                },
                ...deck.cards
            ];

            setDeck({ ...deck, cards: updatedCards, num_cards: updatedCards.length });
            setSuccess("New card added successfully");
            setError(null);
            setAddingNewCard(false);
            setNewCardData({ question: '', answer: '' });
        } catch (err) {
            console.error("Error adding new card:", err);
            setError("Failed to add new card. Please try again.");
            setSuccess(null);
        }
    };

    const handleCancelNewCard = () => {
        setAddingNewCard(false);
        setNewCardData({ question: '', answer: '' });
        setSuccess(null);
        setError(null);
    };

    const handleInputChange = (field, value) => {
        if (cardBeingEdited !== null) {
            setCardBeingEdited({ ...cardBeingEdited, [field]: value });
        } else if (addingNewCard) {
            setNewCardData({ ...newCardData, [field]: value });
        }
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error && !deck) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-red-100 p-4 rounded-lg mb-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </>
        );
    }

    if (!deck) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <p>Deck not found.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8 mt-20 flex justify-center flex-col w-5/6">


                {success && (
                    <div className="bg-green-100 p-4 rounded-lg mb-6 flex items-center justify-between">
                        <p className="text-green-700 flex items-center">
                            <FaCheck className="mr-2" /> {success}
                        </p>
                        <button
                            onClick={() => setSuccess(null)}
                            className="text-green-700 hover:text-green-900"
                        >
                            <FaTimes />
                        </button>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 p-4 rounded-lg mb-6 flex items-center justify-between">
                        <p className="text-red-700">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-700 hover:text-red-900"
                        >
                            <FaTimes />
                        </button>
                    </div>
                )}
                
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleBackToDashboard}
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300"
                    >
                        <FaArrowLeft className="mr-4" /> Back to Deck List
                    </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg overflow-hidden p-4">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-700">Flashcards ({deck.cards.length})</h2>
                        <button
                            onClick={handleAddCardClick}
                            disabled={addingNewCard || cardBeingEdited !== null}
                            className={`bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center transition duration-200 ${addingNewCard || cardBeingEdited !== null ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                        >
                            <FaPlus className="mr-1" /> Add New Card
                        </button>


                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-5/12">Question</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-5/12">Answer</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* New card form row - now at the top */}
                                {addingNewCard && (
                                    <tr className="bg-blue-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">New</td>
                                        <td className="px-6 py-4">
                                            <textarea
                                                value={newCardData.question}
                                                onChange={(e) => handleInputChange('question', e.target.value)}
                                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                rows="3"
                                                placeholder="Enter question"
                                            ></textarea>
                                        </td>
                                        <td className="px-6 py-4">
                                            <textarea
                                                value={newCardData.answer}
                                                onChange={(e) => handleInputChange('answer', e.target.value)}
                                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                rows="3"
                                                placeholder="Enter answer"
                                            ></textarea>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={handleSaveNewCard}
                                                className="text-green-600 hover:text-green-900 mr-3"
                                                disabled={!newCardData.question.trim() || !newCardData.answer.trim()}
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                onClick={handleCancelNewCard}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <FaTimes />
                                            </button>
                                        </td>
                                    </tr>
                                )}

                                {deck.cards.map((card, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        {cardBeingEdited && cardBeingEdited.index === index ? (
                                            // Edit mode
                                            <>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                                <td className="px-6 py-4">
                                                    <textarea
                                                        value={cardBeingEdited.question}
                                                        onChange={(e) => handleInputChange('question', e.target.value)}
                                                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                        rows="3"
                                                        placeholder="Enter question"
                                                    ></textarea>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <textarea
                                                        value={cardBeingEdited.answer}
                                                        onChange={(e) => handleInputChange('answer', e.target.value)}
                                                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                        rows="3"
                                                        placeholder="Enter answer"
                                                    ></textarea>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={handleSaveEdit}
                                                        className={`text-green-600 hover:text-green-900 mr-3 ${!isCardModified() ||
                                                            !cardBeingEdited.question.trim() ||
                                                            !cardBeingEdited.answer.trim()
                                                            ? 'opacity-50 cursor-not-allowed'
                                                            : ''
                                                            }`}
                                                        disabled={
                                                            !isCardModified() ||
                                                            !cardBeingEdited.question.trim() ||
                                                            !cardBeingEdited.answer.trim()
                                                        }
                                                        title={!isCardModified() ? "No changes made" : "Save changes"}
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            // View mode
                                            <>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{card.question}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{card.answer}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                                    <button
                                                        onClick={(e) => toggleDropdown(index, e)}
                                                        className="text-gray-500 hover:text-gray-800 transition duration-200"
                                                        disabled={cardBeingEdited !== null || addingNewCard}
                                                    >
                                                        <BsThreeDotsVertical />
                                                    </button>

                                                    {activeDropdown === index && (
                                                        <div
                                                            ref={dropdownRef}
                                                            className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg z-10 py-1"
                                                            style={{ top: '100%' }}
                                                        >
                                                            <button
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition duration-200"
                                                                onClick={(e) => handleEditClick(index, e)}
                                                            >
                                                                <FaEdit className="mr-2" /> Edit
                                                            </button>
                                                            <button
                                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center transition duration-200"
                                                                onClick={(e) => handleDeleteClick(index, e)}
                                                            >
                                                                <FaTrashAlt className="mr-2" /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}

                                {/* New card form row */}
                                {addingNewCard && (
                                    <tr className="bg-blue-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">New</td>
                                        <td className="px-6 py-4">
                                            <textarea
                                                value={newCardData.question}
                                                onChange={(e) => handleInputChange('question', e.target.value)}
                                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                rows="3"
                                                placeholder="Enter question"
                                            ></textarea>
                                        </td>
                                        <td className="px-6 py-4">
                                            <textarea
                                                value={newCardData.answer}
                                                onChange={(e) => handleInputChange('answer', e.target.value)}
                                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                rows="3"
                                                placeholder="Enter answer"
                                            ></textarea>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={handleSaveNewCard}
                                                className="text-green-600 hover:text-green-900 mr-3"
                                                disabled={!newCardData.question.trim() || !newCardData.answer.trim()}
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                onClick={handleCancelNewCard}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <FaTimes />
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div >

                    {
                        deck.cards.length === 0 && !addingNewCard && (
                            <div className="p-8 text-center">
                                <p className="text-gray-500 mb-4">This deck has no flashcards.</p>
                                <button
                                    onClick={handleAddCardClick}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                                >
                                    <FaPlus className="inline mr-2" /> Add Your First Card
                                </button>
                            </div>
                        )
                    }
                </div >
            </div >

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-center mb-4 text-red-600">
                                <FaExclamationTriangle className="h-12 w-12" />
                            </div>
                            <h3 className="text-xl font-bold text-center mb-2">Delete Card</h3>
                            <p className="text-gray-600 text-center mb-6">
                                Are you sure you want to delete this flashcard? This action cannot be undone.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={cancelDeleteCard}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline duration-300"
                                    disabled={deletingCard}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteCard}
                                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center duration-300"
                                    disabled={deletingCard}
                                >
                                    {deletingCard ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <FaTrashAlt className="mr-2" /> Delete Card
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}