// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Auth from '../../../app/service/auth';
import Exceptions from '../../../app/service/exceptions';
import Mail from '../../../app/service/mail';

declare module 'egg' {
  interface IService {
    auth: Auth;
    exceptions: Exceptions;
    mail: Mail;
  }
}
