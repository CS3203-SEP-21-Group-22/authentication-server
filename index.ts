// @ts-ignore
import jwt from 'jsonwebtoken';
// @ts-ignore
import express from 'express';
// @ts-ignore
import bodyParser from 'body-parser';
// @ts-ignore
import path from 'path';
import { UserLogin, Client } from './index.interface';

const clients: Client[] = [
    { client_id: 'group22-client-id', client_secret: 'group22-secret-key' }
];

const users: UserLogin[] = [
    { email: 'SmithJA@uoe.us', password: '2345#abc', firstName: 'John', lastName: 'Smith' },
    { email: 'BrownTR@uoe.us', password: '9876#def', firstName: 'Tom', lastName: 'Brown' },
    { email: 'JohnsonKA@uoe.us', password: '5432#ghi', firstName: 'Kevin', lastName: 'Johnson' },
    { email: 'TaylorMB@uoe.us', password: '6789#jkl', firstName: 'Mary', lastName: 'Taylor' },
    { email: 'LeeCH@uoe.us', password: '1357#mno', firstName: 'Helen', lastName: 'Lee' },
    { email: 'WalkerJS@uoe.us', password: '2468#pqr', firstName: 'Sam', lastName: 'Walker' },
    { email: 'HarrisAG@uoe.us', password: '1590#stu', firstName: 'Alice', lastName: 'Harris' },
    { email: 'MartinBM@uoe.us', password: '8642#vwx', firstName: 'Brian', lastName: 'Martin' },
    { email: 'ThompsonDR@uoe.us', password: '7531#yz', firstName: 'David', lastName: 'Thompson' },
    { email: 'GarciaLM@uoe.us', password: '9087#klm', firstName: 'Linda', lastName: 'Garcia' }
];

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

function generateIdToken(email: string, firstName: string, lastName: string, client: Client): string {
    return jwt.sign({ email: email, firstName: firstName, lastName: lastName, client_id: client.client_id }, client.client_secret, { algorithm: 'HS256', expiresIn: '15m' });
}

function generateAccessToken(email: string, client: Client): string {
    return jwt.sign({ email: email, client_id: client.client_id }, client.client_secret, { algorithm: 'HS256', expiresIn: '1h' });
}

function generateRefreshToken(email: string, client: Client): string {
    return jwt.sign({ email: email, client_id: client.client_id }, client.client_secret, { algorithm: 'HS256', expiresIn: '7d' });
}

function verifyToken(token: string): any {
    const client_id = jwt.decode(token).client_id;
    const client = clients.find(c => c.client_id === client_id);
    if (!client) {
        throw new Error('Invalid token');
    } else {
        return jwt.verify(token, client.client_secret);
    }
}

app.get('/login', (req: express.Request, res: express.Response) => {
    const redirectUri = req.query.redirect_uri;
    const clientId = req.query.client_id;
    if (!redirectUri) {
        return res.status(400).send({ message: 'Bad Request' });
    }
    res.render('login', { redirectUri: redirectUri, clientId: clientId });
});

app.post('/login', (req: express.Request, res: express.Response) => {
    const { email, password, redirectUri, clientId } = req.body;
    if (!email || !password || !redirectUri || !clientId) {
        return res.status(400).send({ message: 'Bad Request' });
    }
    const client = clients.find(c => c.client_id === clientId);
    if (!client) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        const idToken = generateIdToken(user.email, user.firstName, user.lastName, client)
        const accessToken = generateAccessToken(user.email, client)
        const refreshToken = generateRefreshToken(user.email, client)
        res.redirect(`${redirectUri}?id_token=${idToken}&access_token=${accessToken}&refresh_token=${refreshToken}`);
    } else {
        res.status(401).send({ message: 'Unauthorized' });
    }
});

app.post('/refresh', (req: express.Request, res: express.Response) => {
    const { refresh_token } = req.body;
    if (!refresh_token) {
        return res.status(400).send({ message: 'Bad Request' });
    }
    try {
        const decoded = verifyToken(refresh_token);
        const client = clients.find(c => c.client_id === decoded.client_id);
        if (!client) return res.status(401).send({ message: 'Unauthorized' });
        const accessToken = generateAccessToken(decoded.email, client);
        res.send({ access_token: accessToken });
    } catch (error) {
        res.status(401).send({ message: 'Unauthorized' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
