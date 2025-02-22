import { Request, Response } from 'express';
import { UserService } from './userService';

const userService = new UserService();

export async function login(req: Request, res: Response) {
    const { username, password } = req.body;

    if (await userService.validateExistingUser(username, password)) {
        res.status(200).send('You have logged in');
    } else {
        res.status(401).send('Invalid credentials');
    }
}