import { Request, Response, NextFunction } from 'express';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    //didn't work on this bcs I did not get the auth bearer token due to some issues while setup
  console.log(' Middleware request received');
  next();
};