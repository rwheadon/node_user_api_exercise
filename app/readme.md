# User API Microservice #

This microservice is responsible for the following features:
1. Basic User CRUD
2. Authentication operations 
3. JWT Token operations

## Basic User CRUD ##
**Create** : POST /user  
**Read** : GET /user/{id}  
**Update** : PUT /user  
**Delete** : DELETE /user/{id}

User creation in this microservice is for the purpose of logins and profiles.
This is not the contact manager, though it *could* be enhanced to contain
familial or group relationship management (Though I don't recomment it).  

When a User is created it must have a unique username and of course auto-generated id.

## swagger ##
Docs are generated automatically by design convention in routes.  
http://localhost:{env.development.port}/api-docs/

## Authentication Operations ##
Authentication operations are not present yet

## JWT Token Operations ##
JWT Token operations are not present yet

### FUTURE GRPC INTEGRATION ###
This module is a perfect fit for using gRPC  
[GRPC : grpc.io](https://grpc.io/docs/languages/node/basics/)  
[gRPC starter : Trend Micro](https://www.trendmicro.com/en_us/devops/22/f/grpc-api-tutorial.html)  
[gRPC tutorial : Hussein Nasser](https://www.youtube.com/watch?v=Yw4rkaTc0f8)

