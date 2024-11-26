
const books = [
  { id: '1', title: '1984', author: 'George Orwell' },
  { id: '2', title: 'Brave New World', author: 'Aldous Huxley' },
  { id: '3', title: 'The Catcher in the Rye', author: 'J.D. Salinger' }
];

const resolvers = {
  Query: {
    books: () => books,
  },
};

export default resolvers;
