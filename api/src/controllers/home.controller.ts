import {
  BaseHttpController,
  controller,
  httpGet,
} from 'inversify-express-utils';

@controller('/')
export class HomeController extends BaseHttpController {
  @httpGet('/')
  public Get(): string {
    return 'Welcome to Tstore API';
  }
}
