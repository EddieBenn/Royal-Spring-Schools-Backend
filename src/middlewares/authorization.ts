import { Response, NextFunction} from 'express';
import {JwtPayload} from 'jsonwebtoken'
import { verifySignature } from '../utilities/helpers';

export const authoriser = async (req: JwtPayload, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers.authorization;

        if (authorization === undefined) {
            return res.status(401).send({
                status: "error",
                message: "Ensure that you are logged in",
            });
        }

        const pin = authorization.split(" ")[1];

        if (!pin || pin === "") {
            return res.status(401).send({
                status: "error",
                message: "Ensure that you are logged in",
            });
        }

        const decoded = await verifySignature(pin);

        if (!decoded) {
            return res.status(401).json({ status: "error", message: "Ensure that you are logged in" });
        }

        req.user = decoded;
        return next();
    } catch (err: any) {
        console.log("Token verification error:", err.message);
        return res.status(401).send({
            status: "error",
            message: err.message,
        });
    }
};
