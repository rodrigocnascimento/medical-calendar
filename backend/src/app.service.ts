import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  hello(): any {
    return 'Hello World!';
  }
}
