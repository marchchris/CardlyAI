import { ObjectId } from 'mongodb';

export interface Card {
  question: string;
  answer: string;
}

export interface Deck {
  _id?: ObjectId;
  title: string;
  colour: string;
  num_cards: number;
  cards: Card[];
  created_at: Date;
}

export interface User {
  userID: string;
  decks: Deck[];
}
