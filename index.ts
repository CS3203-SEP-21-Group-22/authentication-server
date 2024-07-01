// @ts-ignore
import jwt from 'jsonwebtoken';
// @ts-ignore
import express from 'express';
import { UserLogin } from './index.interface';

const secretKey: string = 'group22-secret-key';
const users: UserLogin[] = [
    { email: 'SmithJA@uoe.us', password: '2345#abc' },
    { email: 'BrownTR@uoe.us', password: '9876#def' },
    { email: 'JohnsonKA@uoe.us', password: '5432#ghi' },
    { email: 'TaylorMB@uoe.us', password: '6789#jkl' },
    { email: 'LeeCH@uoe.us', password: '1357#mno' },
    { email: 'WalkerJS@uoe.us', password: '2468#pqr' },
    { email: 'HarrisAG@uoe.us', password: '1590#stu' },
    { email: 'MartinBM@uoe.us', password: '8642#vwx' },
    { email: 'ThompsonDR@uoe.us', password: '7531#yz' },
    { email: 'GarciaLM@uoe.us', password: '9087#klm' }
];

const app = express();
app.use(express.json());

app.post('/login', (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        const token = jwt.sign({ email: email }, secretKey, { algorithm: 'HS256', expiresIn: '1h' });
        res.status(200).send({ token: token });
    } else {
        res.status(401).send({ message: 'Unauthorized' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
