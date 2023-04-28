import { Request } from 'express';
import { User } from '../../../user/entities/user.entity';
import { Vendor } from '../../../vendor/entities/vendor.entity';
export class ReqWithVendor extends Request {
  user: Vendor;
}
