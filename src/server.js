const port = process.env.PORT || 5000;
const fs = require('fs');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLFloat
} = require('graphql');

//READING FILES
console.log('Parsing authors...')
let rawdata = fs.readFileSync('authors.json')
const authors = JSON.parse(rawdata)

console.log('Parsing books...')
rawdata = fs.readFileSync('books.json')
const books = JSON.parse(rawdata)

const AuthorType = new GraphQLObjectType({
    name : 'Author',
    description : 'Writer of a book',
    fields : () => ({
        id : { type : GraphQLInt },
        name : { type : GraphQLString },
        books : {
            type : GraphQLList(BookType),
            resolve : (author) => books.filter(b => b.authorId === author.id)
        }
    })
})

const BookType = new GraphQLObjectType({
    name : 'Book',
    description : 'Masterpiece written by author',
    fields : () => ({
        id : { type : GraphQLNonNull(GraphQLInt) },
        title : { type: GraphQLNonNull(GraphQLString) },
        year : {
            type : GraphQLNonNull(GraphQLInt),
            resolve : (parent) => parent.year_written 
        },
        edition : { type: GraphQLString },
        price : { type : GraphQLFloat },
        authorId : {
            type : GraphQLNonNull(GraphQLInt)
        },
        author : {
            type: AuthorType,
            resolve: (book) => authors.find(a => a.id === book.authorId)
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name : 'Query',
    description : 'Root Query',
    fields : () => ({
        book : {
            type : BookType,
            description : 'Return a single book',
            args : {
                id : { 
                    type: GraphQLInt,
                    description : 'Book identifier'
                }
            },
            resolve: (_, args) => books.find(b => b.id === args.id)
        },
        books : {
            type : GraphQLList(BookType),
            description : 'Return all the books',
            resolve: () => books
        },
        author : {
            type : AuthorType,
            description : 'Return a single author',
            args : {
                id : { 
                    type: GraphQLInt,
                    description : 'Author identifier'
                }
            },
            resolve: (_, args) => authors.find(a => a.id === args.id)
        },        
        authors : {
            type : GraphQLList(AuthorType),
            description : 'Returns all the authors',
            resolve: () => authors 
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name : 'Mutation',
    description : 'Root mutation',
    fields : () => ({
        addBook : {
            type : BookType,
            description : 'Add a new book',
            args : {
                title : { type : GraphQLNonNull(GraphQLString) },
                authorId : { type : GraphQLNonNull(GraphQLInt) },
                year : {type : GraphQLInt}
            },
            resolve : (_, args) => {
                const book = { 
                    id : books.length + 1,
                    title : args.title,
                    authorId : args.authorId,
                    year_written : (args.year === undefined) ? new Date().getFullYear() : args.year
                }
                books.push(book)
                return book
            }
        },
        addAuthor : {
            type : AuthorType,
            description : 'Add an author',
            args : {
                name : { type : GraphQLNonNull(GraphQLString) },
            },
            resolve : (_, args) => {
                const author = { 
                    id : authors.length + 1,
                    name : args.name,
                }
                authors.push(author)
                return author
            }
        }
    })
})


const schema = new GraphQLSchema({
    query : RootQueryType,
    mutation : RootMutationType
})
 
var app = express();
app.use(express.json())

//GRAPHQL
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: RootQueryType,
  graphiql: true,
}));

//REST API
app.get('/api/authors', (req, res) => {
    console.log('Received GET authors')
    res.end(JSON.stringify(authors))
})
app.get('/api/authors/:id', (req, res) => {
    console.log(`Received GET author by id: ${req.params.id}`)
    const author = authors.find(a => a.id == req.params.id) // 5 == "5"
    //res.end(JSON.stringify(author))
    if (author !== undefined)
        res.json(author)

    res.status(404).send('Author not found')
})
app.get('/api/books', (req, res) => {
    console.log('Received GET books')
    res.end(JSON.stringify(books))
})
app.get('/api/books/:id', (req, res) => {
    console.log(`Received GET book by id: ${req.params.id}`)
    const book = books.find(b => b.id == req.params.id)
    res.end(JSON.stringify(book))
})
app.post('/api/books', (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body)) //WTF?
    const book = {
        id : books.length + 1,
        title : body['title'],
        authorId : body['authorId']
    }
    books.push(book)
    res.status(204).send(JSON.stringify(book))
})

//web server
app.listen(port, console.log(`Running a GraphQL API server at http://localhost:${port}/graphql`)); //string interpolation