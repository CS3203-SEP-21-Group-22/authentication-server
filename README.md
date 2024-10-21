# Inventory Management System for computer laboratories - Authentication Server

#### Authentication server of Inventory Management System for computer laboratories, is an abstract implementation, which was developed to mock the existing user management system of the Institution.

## Local Development Setup

### Prerequisites

- [Node.js v20+](https://nodejs.org/en/download/)

### Steps

1. Clone the repository.

   ```
   git clone https://github.com/CS3203-SEP-21-Group-22/authentication-server.git
   ```

2. Navigate to the project directory.

   ```
   cd authentication-server
   ```

3. Install the dependencies.

   ```
   npm install
   ```

4. In index.ts file, add a client under `clients` object with the following structure.

   ```
   {
      "client_id": "CLIENT_ID_FOR_YOUR_BACKEND",
      "client_secret": "CLIENT_SECRET_FOR_YOUR_BACKEND"
   }
   ```

5. Start the server. The server will run on port 3001.

   ```
   npm start
   ```
