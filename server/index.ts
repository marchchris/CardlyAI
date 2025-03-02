import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';

dotenv.config();

const PORT = process.env.PORT

const app: Application = express();

// Add middleware to parse JSON bodies
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri: string = process.env.MONGODB_URI || '';
const DB_NAME: string = process.env.MONGODB_NAME || '';
const DB_COLLECTION: string = process.env.MONGODB_COLLECTION_NAME || '';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Define User interface
interface User {
  userID: string;
  decks: Deck[];
}

// Define Deck interface
interface Deck {
  _id?: ObjectId;
  title: string;
  colour: string;
  num_cards: number;
  content: string;
  created_at: Date;
}

// Connect to MongoDB once at startup
let database: any;

async function connectToDatabase() {
  try {
    await client.connect();
    database = client.db(DB_NAME);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1);
  }
}

// Create User route
app.post('/api/createUser', async (req: Request, res: Response) => {
  try {
    const { userID }: {userID: string} = req.body;

    if (!userID || typeof userID !== 'string') {
      res.status(400).json({ error: 'Valid userID is required' });
    }

    const usersCollection = database.collection(DB_COLLECTION);

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ userID });
    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
    }

    const newUser: User = {
      userID,
      decks: []
    };

    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
      insertedId: result.insertedId
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete User route
app.delete('/api/deleteUser', async (req: Request, res: Response) => {
  try {
    const { userID }: {userID: string}  = req.body;

    if (!userID || typeof userID !== 'string') {
      res.status(400).json({ error: 'Valid userID is required' });
    }

    const usersCollection = database.collection(DB_COLLECTION);

    // Check if user exists before deletion
    const user = await usersCollection.findOne({ userID });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }

    // Delete the user
    const result = await usersCollection.deleteOne({ userID });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Deck route
app.post('/api/createDeck', async (req: Request, res: Response) => {
  try {
    const { userID, title, colour, num_cards, content }: {
      userID: string;
      title: string;
      colour: string;
      num_cards: number;
      content: string;
    } = req.body;

    // Validate required fields
    if (!userID || typeof userID !== 'string') {
      res.status(400).json({ error: 'Valid userID is required' });
    }

    if (!title || typeof title !== 'string') {
      res.status(400).json({ error: 'Valid title is required' });
    }

    if (!colour || typeof colour !== 'string') {
      res.status(400).json({ error: 'Valid colour is required' });
    }

    if (num_cards === undefined || typeof num_cards !== 'number') {
      res.status(400).json({ error: 'Valid num_cards is required' });
    }

    if (!content || typeof content !== 'string') {
      res.status(400).json({ error: 'Valid content is required' });
    }

    const usersCollection = database.collection(DB_COLLECTION);

    // Check if user exists
    const user = await usersCollection.findOne({ userID });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }

    // Create new deck object
    const newDeck: Deck = {
      _id: new ObjectId(),
      title,
      colour,
      num_cards,
      content,
      created_at: new Date()
    };

    // Add deck to user's decks array
    const result = await usersCollection.updateOne(
      { userID },
      { $push: { decks: newDeck } }
    );

    if (result.modifiedCount === 0) {
      res.status(500).json({ error: 'Failed to add deck to user' });
    }

    res.status(201).json({
      message: 'Deck created successfully',
      deck: newDeck
    });
  } catch (error) {
    console.error('Error creating deck:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get User Decks route
app.get('/api/getUserDecks/:userID', async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    if (!userID || typeof userID !== 'string') {
      res.status(400).json({ error: 'Valid userID is required' });
    }

    const usersCollection = database.collection(DB_COLLECTION);

    // Find the user by ID
    const user = await usersCollection.findOne({ userID });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }

    // Return the decks array
    res.status(200).json({
      message: 'Decks retrieved successfully',
      decks: user.decks || []
    });
  } catch (error) {
    console.error('Error retrieving user decks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Connect to database before starting server
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
});