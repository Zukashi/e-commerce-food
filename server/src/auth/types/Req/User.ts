import { Request } from 'express';
import { User } from '../../../user/entities/user.entity';

interface ReqWithCustomer extends Request {
  user: User;
}

export { ReqWithCustomer };
