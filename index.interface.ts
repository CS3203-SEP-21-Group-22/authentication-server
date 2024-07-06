interface UserLogin {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface Client {
    client_id: string;
    client_secret: string;
}

export { UserLogin, Client };
