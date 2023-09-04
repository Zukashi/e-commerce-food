import { Request } from 'express';
import { User } from '../../../user/entities/user.entity';
import { Vendor } from '../../../vendor/entities/vendor.entity';
export interface ReqWithVendor extends Request {
  user: Vendor;
}
