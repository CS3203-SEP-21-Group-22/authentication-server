# authentication-server


### Install and run the server
```
 npm install
```
```
 npm start
```

### Authentication API
```
POST http://localhost:3000/login
Request Body:
{
    "email": "email",
    "password": "password"
}

Success Response ~ Status Code: 200
Response Body:
{
    "token": "eyJhbGci"
}

Error Response ~ Status Code: 401
```
