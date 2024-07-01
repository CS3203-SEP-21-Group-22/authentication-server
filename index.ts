// @ts-ignore
import jwt from 'jsonwebtoken';
// @ts-ignore
import express from 'express';
import { UserLogin } from './index.interface';

const secretKey: string = 'group22-secret-key';
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

app.post('/login', (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        const token = jwt.sign({ email: email, firstName: user.firstName, lastName: user.lastName }, secretKey, { algorithm: 'HS256', expiresIn: '1h' });
        res.status(200).send({ token: token });
    } else {
        res.status(401).send({ message: 'Unauthorized' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
