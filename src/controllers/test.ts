
import { NextFunction, Request, Response } from 'express';

export class UserController {
  public me = async (req: Request, res: Response): Promise<void> => {
   
      res.status(200).json({message : 'test'} );
   
  };
}

export default UserController;
