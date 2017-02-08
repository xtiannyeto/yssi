import {Pipe, PipeTransform} from '@angular/core';
import { Users } from '../../../../both/collections/users.collection';
import { User } from '../../../../both/models/user.model';

@Pipe({
  name: 'displayUser'
})
export class DisplayUserPipe implements PipeTransform {
  transform(userId: string) {
    if (!userId) {
      return;
    }

    let user: User = Users.findOne((userId));
    if (user) {
      return user;
    }
    return;
  }
}