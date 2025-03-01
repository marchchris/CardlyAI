import { useState } from 'react';

export default function Flashcard({ question, answer }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div
            className="flashcard-container h-64 w-full perspective-1000 cursor-pointer"
            onClick={handleFlip}
        >
            <div 
                className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                }`}
            >
                <div className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center">
                    <div className="text-xl font-medium text-gray-800">{question}</div>
                    <div className="mt-4 text-sm text-gray-500">Click to flip</div>
                </div>

                <div className="absolute w-full h-full backface-hidden bg-blue-50 rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center rotate-y-180">
                    <div className="text-xl font-medium text-gray-800">{answer}</div>
                    <div className="mt-4 text-sm text-gray-500">Click to flip back</div>
                </div>
            </div>
        </div>
    );
}
