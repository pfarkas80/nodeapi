# Local development
## Prerequisites
- Download node.js
## Run
```
npm run devStart
```

# API
Proof of concept to compare different API approaches
## REST API
```
http://localhost:5000/api/authors
http://localhost:5000/api/books
```
## GraphQL
```
http://localhost:5000/graphql
```


# Docker container
## Build container
```
cd src
docker build .
```
## Start container
From a unix host
```
docker run -p 8080:5000 -d pfarkas80/nodeapi
```