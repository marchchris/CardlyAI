const API_URL = process.env.REACT_APP_API_URL || '';

/**
 * Creates a new user in the database
 * @param {string} userID - The unique identifier for the user
 * @returns {Promise<Object>} - Response with the created user data
 */
export const createUser = async (userID) => {
  try {
    const response = await fetch(`${API_URL}/api/createUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userID }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create user');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Deletes a user from the database
 * @param {string} userID - The unique identifier for the user
 * @returns {Promise<Object>} - Response with deletion confirmation
 */
export const deleteUser = async (userID) => {
  try {
    const response = await fetch(`${API_URL}/api/deleteUser`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userID }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete user');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Creates a new deck with AI-generated flashcards for a user
 * @param {string} userID - The unique identifier for the user
 * @param {string} title - The title of the deck
 * @param {string} colour - The color/theme of the deck
 * @param {number} num_cards - The number of cards to generate
 * @param {string} content - The content to use for generating flashcards
 * @returns {Promise<Object>} - Response with the created deck data
 */
export const createDeck = async (userID, title, colour, num_cards, content) => {
  try {
    const response = await fetch(`${API_URL}/api/createDeck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userID, 
        title, 
        colour, 
        num_cards, 
        content 
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create deck');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating deck:', error);
    throw error;
  }
};

/**
 * Generates flashcards without requiring a user account or saving to database
 * @param {string} title - The title of the deck
 * @param {string} colour - The color/theme of the deck
 * @param {number} num_cards - The number of cards to generate
 * @param {string} content - The content to use for generating flashcards
 * @returns {Promise<Object>} - Response with the generated deck data
 */
export const generateDeck = async (title, colour, num_cards, content) => {
  try {
    const response = await fetch(`${API_URL}/api/generateDeck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        title, 
        colour, 
        num_cards, 
        content 
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate flashcards');
    }
    
    return data;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
};

/**
 * Retrieves all decks for a specific user
 * @param {string} userID - The unique identifier for the user
 * @returns {Promise<Array>} - Array of deck objects belonging to the user
 */
export const getUserDecks = async (userID) => {
  try {
    const response = await fetch(`${API_URL}/api/getUserDecks/${userID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to retrieve user decks');
    }
    
    return data.decks;
  } catch (error) {
    console.error('Error retrieving user decks:', error);
    throw error;
  }
};

/**
 * Retrieves a specific deck by its ID
 * @param {string} userID - The unique identifier for the user
 * @param {string} deckID - The unique identifier for the deck
 * @returns {Promise<Object>} - The deck object
 */
export const getDeckById = async (userID, deckID) => {
  try {
    const response = await fetch(`${API_URL}/api/getDeck/${userID}/${deckID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to retrieve deck');
    }
    
    return data.deck;
  } catch (error) {
    console.error('Error retrieving deck:', error);
    throw error;
  }
};

/**
 * Edits an existing card in a deck
 * @param {string} userID - The unique identifier for the user
 * @param {string} deckID - The unique identifier for the deck
 * @param {number} cardIndex - The index of the card to edit
 * @param {string} question - The updated question text
 * @param {string} answer - The updated answer text
 * @returns {Promise<Object>} - The updated card and deck
 */
export const editCard = async (userID, deckID, cardIndex, question, answer) => {
  try {
    const response = await fetch(`${API_URL}/api/card/${userID}/${deckID}/${cardIndex}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, answer }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update card');
    }
    
    return data;
  } catch (error) {
    console.error('Error editing card:', error);
    throw error;
  }
};

/**
 * Deletes a card from a deck
 * @param {string} userID - The unique identifier for the user
 * @param {string} deckID - The unique identifier for the deck
 * @param {number} cardIndex - The index of the card to delete
 * @returns {Promise<Object>} - The updated deck
 */
export const deleteCard = async (userID, deckID, cardIndex) => {
  try {
    const response = await fetch(`${API_URL}/api/card/${userID}/${deckID}/${cardIndex}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete card');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};

/**
 * Adds a new card to a deck
 * @param {string} userID - The unique identifier for the user
 * @param {string} deckID - The unique identifier for the deck
 * @param {string} question - The question text for the new card
 * @param {string} answer - The answer text for the new card
 * @returns {Promise<Object>} - The new card and updated deck
 */
export const addCard = async (userID, deckID, question, answer) => {
  try {
    const response = await fetch(`${API_URL}/api/card/${userID}/${deckID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, answer }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add card');
    }
    
    return data;
  } catch (error) {
    console.error('Error adding card:', error);
    throw error;
  }
};
