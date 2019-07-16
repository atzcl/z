/**
 * @description User-Service parameters
 */
export interface UserOptions {
  id: number;
}

/**
 * @description User-Service response
 */
export interface UserResult {
  id: number;
  username: string;
  phone: string;
  email?: string;
}

/**
 * @description User-Service abstractions
 */
export interface UserService {
  getUser(options: UserOptions): Promise<UserResult>;
}
