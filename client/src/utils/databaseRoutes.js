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
