import { ObjectId } from 'mongodb';

export interface Deck {
  _id?: ObjectId;
  title: string;
  colour: string;
  num_cards: number;
  content: string;
  created_at: Date;
}

export interface User {
  userID: string;
  decks: Deck[];
}
