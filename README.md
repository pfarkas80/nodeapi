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
docker build . -t pfarkas80/nodeapi:latest-pie --platform linux/arm/v7
```
## Start container
From a unix host
```
docker run -p 8080:5000 -d pfarkas80/nodeapi:latest-pie
```

## Migrate container without repository
```
docker save -o c:\temp\nodeapi_pie.tar pfarkas80/nodeapi:latest-pie
docker load -i /media/hdd/nodeapi_pie.tar
```

# References
- https://graphql.org/graphql-js/running-an-express-graphql-server/
- https://scotch.io/bar-talk/creating-graphql-subscriptions-in-express
- https://github.com/apollographql/graphql-subscriptions
- https://scotch.io/bar-talk/creating-graphql-subscriptions-in-express