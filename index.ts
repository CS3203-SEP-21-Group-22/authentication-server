// @ts-ignore
import jwt from "jsonwebtoken";
// @ts-ignore
import express from "express";
// @ts-ignore
import bodyParser from "body-parser";
// @ts-ignore
import path from "path";
import { Request, Response } from "express";
import { Client, UserLogin, UserData } from "./index.interface";

// sample clients of authentication server
const clients: Client[] = [
  // .NET web app client
  {
    client_id: "group22-client-id",
    client_secret:
      "group22-secret-key-sadfghjkqwertrytyuiozxcvbnmwertyasddgh3456jtyygfdsdfdghytrew",
  },
];

// sample user data
const users: UserLogin[] = [
  {
    email: "SmithJA@uoe.us",
    password: "2345#abc",
    firstName: "John",
    lastName: "Smith",
    contactNumber: "+44234567890",
  },
  {
    email: "BrownTR@uoe.us",
    password: "9876#def",
    firstName: "Tom",
    lastName: "Brown",
    contactNumber: "+44876543210",
  },
  {
    email: "JohnsonKA@uoe.us",
    password: "5432#ghi",
    firstName: "Kevin",
    lastName: "Johnson",
    contactNumber: "+44543218970",
  },
  {
    email: "TaylorMB@uoe.us",
    password: "6789#jkl",
    firstName: "Mary",
    lastName: "Taylor",
    contactNumber: "+44654329810",
  },
  {
    email: "LeeCH@uoe.us",
    password: "1357#mno",
    firstName: "Helen",
    lastName: "Lee",
    contactNumber: "+44765432190",
  },
  {
    email: "WalkerJS@uoe.us",
    password: "2468#pqr",
    firstName: "Sam",
    lastName: "Walker",
    contactNumber: "+44876543210",
  },
  {
    email: "HarrisAG@uoe.us",
    password: "1590#stu",
    firstName: "Alice",
    lastName: "Harris",
    contactNumber: "+44654329810",
  },
  {
    email: "MartinBM@uoe.us",
    password: "8642#vwx",
    firstName: "Brian",
    lastName: "Martin",
    contactNumber: "+44543218970",
  },
  {
    email: "ThompsonDR@uoe.us",
    password: "7531#yz",
    firstName: "David",
    lastName: "Thompson",
    contactNumber: "+44234567890",
  },
  {
    email: "GarciaLM@uoe.us",
    password: "9087#klm",
    firstName: "Linda",
    lastName: "Garcia",
    contactNumber: "+44765432190",
  },
];

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); // enables ejs template engine
app.use(express.static(path.join(__dirname, "public"))); // serves static files from public folder

// helper functions
function generateIdToken(
  email: string,
  firstName: string,
  lastName: string,
  contactNumber: string,
  client: Client
): string {
  return jwt.sign(
    {
      email: email,
      firstName: firstName,
      lastName: lastName,
      contactNumber: contactNumber,
      client_id: client.client_id,
    },
    client.client_secret,
    { algorithm: "HS256", expiresIn: "15m" }
  );
}

function generateAccessToken(email: string, client: Client): string {
  return jwt.sign(
    { email: email, client_id: client.client_id },
    client.client_secret,
    { algorithm: "HS256", expiresIn: "1h" }
  );
}

function generateRefreshToken(email: string, client: Client): string {
  return jwt.sign(
    { email: email, client_id: client.client_id },
    client.client_secret,
    { algorithm: "HS256", expiresIn: "7d" }
  );
}

// validates refresh token and returns decoded data
function verifyToken(token: string): any {
  const client_id = jwt.decode(token).client_id;
  const client = clients.find((c) => c.client_id === client_id);
  if (!client) {
    throw new Error("Invalid token");
  } else {
    return jwt.verify(token, client.client_secret);
  }
}

// returns a list of all users with necessary data
function getUserDataList(): UserData[] {
  return users.map((user) => {
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      contactNumber: user.contactNumber,
    };
  });
}

// API routes
// renders login page with redirectUri and clientId
app.get("/login", (req: Request, res: Response) => {
  let redirectUri = req.query.redirectUri?.toString();
  let clientId = req.query.clientId?.toString();
  if (!redirectUri || !clientId) {
    return res.status(400).send({ message: "Bad Request" });
  }
  if (redirectUri && redirectUri.includes("?"))
    redirectUri = redirectUri.split("?")[0];
  if (clientId && clientId.includes("?")) clientId = clientId.split("?")[0];
  res.render("login", { redirectUri: redirectUri, clientId: clientId });
});

// Validates user credentials and redirects to redirectUri with tokens
app.post("/login", (req: Request, res: Response) => {
  const { email, password, redirectUri, clientId } = req.body;
  if (!email || !password || !redirectUri || !clientId) {
    return res.status(400).send({ message: "Bad Request" });
  }
  const client = clients.find((c) => c.client_id === clientId);
  if (!client) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    // successful login
    const idToken = generateIdToken(
      user.email,
      user.firstName,
      user.lastName,
      user.contactNumber,
      client
    );
    const accessToken = generateAccessToken(user.email, client);
    const refreshToken = generateRefreshToken(user.email, client);
    res.redirect(
      `${redirectUri}?id_token=${idToken}&access_token=${accessToken}&refresh_token=${refreshToken}`
    );
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
});

// generates new access token using refresh token
app.post("/refresh", (req: Request, res: Response) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(400).send({ message: "Bad Request" });
  }
  try {
    const decoded = verifyToken(refresh_token);
    const client = clients.find((c) => c.client_id === decoded.client_id);
    if (!client) return res.status(401).send({ message: "Unauthorized" });
    const accessToken = generateAccessToken(decoded.email, client);
    res.send({ access_token: accessToken });
  } catch (error) {
    res.status(401).send({ message: "Unauthorized" });
  }
});

// returns user data list
app.post("/poll-data", (req: Request, res: Response) => {
  const { client_id, client_secret } = req.body;
  const client = clients.find(
    (c) => c.client_id === client_id && c.client_secret === client_secret
  );
  if (!client) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const userDataList = getUserDataList();
  res.send(userDataList);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
