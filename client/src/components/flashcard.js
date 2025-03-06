import { useState, useEffect, forwardRef } from 'react';

const Flashcard = forwardRef(({ question, answer, onFlip }, ref) => {
    const [isFlipped, setIsFlipped] = useState(false);
    
    // Reset the flip state when the question or answer changes
    useEffect(() => {
        setIsFlipped(false);
    }, [question, answer]);

    const handleFlip = () => {
        const newFlipState = !isFlipped;
        setIsFlipped(newFlipState);
        
        // Notify parent component about flip state if callback exists
        if (onFlip) {
            onFlip(newFlipState);
        }
    };

    // Effect to handle keyboard events for flipping the card
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Up or down arrow keys flip the card
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                handleFlip();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFlipped]); // Re-attach when isFlipped changes to keep the closure updated

    // Expose a reset method and flip method through the ref
    if (ref) {
        ref.current = {
            reset: () => setIsFlipped(false),
            flip: () => handleFlip()
        };
    }

    return (
        <div 
            className="flashcard-container w-full h-80 cursor-pointer"
            onClick={handleFlip}
        >
            <div className="relative w-full h-full perspective-1000">
                {/* Card container */}
                <div 
                    className={`absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                        isFlipped ? 'rotate-y-180' : ''
                    }`}
                >
                    {/* Front side (Question) */}
                    <div className="absolute w-full h-full backface-hidden bg-white p-6 rounded-lg shadow-md flex flex-col justify-center items-center text-center">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Question:</h3>
                        <div className="text-gray-800 text-lg overflow-auto max-h-48 px-2">{question}</div>
                        <div className="absolute bottom-4 text-sm text-gray-500">
                            Click to see answer
                        </div>
                    </div>

                    {/* Back side (Answer) */}
                    <div className="absolute w-full h-full backface-hidden bg-white p-6 rounded-lg shadow-md flex flex-col justify-center items-center text-center rotate-y-180">
                        <h3 className="text-xl font-semibold text-green-700 mb-4">Answer:</h3>
                        <div className="text-gray-800 text-lg overflow-auto max-h-48 px-2">{answer}</div>
                        <div className="absolute bottom-4 text-sm text-gray-500">
                            Click to see question
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    );
});

Flashcard.displayName = 'Flashcard';

export default Flashcard;
