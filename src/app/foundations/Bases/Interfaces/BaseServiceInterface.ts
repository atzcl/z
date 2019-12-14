import { BuildsQueries } from '@app/foundations/ORM/Model';

import { BaseRequest } from '../BaseRequest';


export interface PaginateProps {
  builder?: BuildsQueries;
  request: typeof BaseRequest.prototype.request;
  currentPageField?: string;
  pageSizeField?: string;
}
