import { Request, Response, NextFunction } from 'express';

export abstract class BaseController {
  protected abstract execute(req: Request, res: Response, next?: NextFunction): Promise<void | any>;

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.execute(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}