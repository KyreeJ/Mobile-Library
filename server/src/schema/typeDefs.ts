import {gql} from 'graphql-tag'

const typeDefs = gql`

type Book {
    title: String!
    author: String!
}


type Role {
    name: String!
}


input CreateUser {
    name: String!
    age: Int!
    isAuthor: Boolean
    role: String!  # role as a string
}

input UpdateUser {
    id: ID!
    name: String
    age: Int
    isAuthor: Boolean
    role: String
}

input DeleteUser {
    id: ID!
}


type User {
    name: String!
    age: Int!
    isAuthor: Boolean
    role: String!
}


input saveBook {
    id: ID!
    title: String!
    author: String!
    isAuthor: Boolean
    role: String!  # role as a string
}


type Query {
    returnBook: Book
    user(id: ID!): User!
    userByName(name: String!): User!
    books: [Book]
}


type Mutation {
    createUser(newUser: CreateUser!): User
    updateUser(updatedUser: UpdateUser!): User
    deleteUser(delUser: DeleteUser!): User
}




`;

export default typeDefs