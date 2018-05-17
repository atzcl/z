// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import AuthJwt from '../../../app/middleware/auth_jwt';
import Exceptions from '../../../app/middleware/exceptions';
import XmlToJson from '../../../app/middleware/xml_to_json';

declare module 'egg' {
  interface IMiddleware {
    authJwt: ReturnType<typeof AuthJwt>;
    exceptions: ReturnType<typeof Exceptions>;
    xmlToJson: ReturnType<typeof XmlToJson>;
  }
}
