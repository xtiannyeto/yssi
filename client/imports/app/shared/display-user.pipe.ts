import { Pipe, PipeTransform } from '@angular/core';
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

    let user: User = Users.findOne(userId);

    if (user) {
      return user;
    }
    return;
  }
}

@Pipe({
  name: 'displayName'
})
export class DisplayNamePipe implements PipeTransform {
  transform(user: User): string {

    if (user == null || user === undefined) {
      return 'unknow...';
    }

    if (user.profile != null && !(user.profile === undefined)) {
      return user.profile.name;
    }

    if (user.emails) {
      return user.emails[0].address;
    }

    return '';
  }
}

@Pipe({
  name: 'displayEmail'
})
export class DisplayEmailPipe implements PipeTransform {
  transform(user: User): string {

    if (user == null || user === undefined) {
      return 'unknow...';
    }

    if (user.profile != null && !(user.profile === undefined)) {
      return user.profile.email;
    }

    if (user.emails) {
      return user.emails[0].address;
    }

    return '';
  }
}

@Pipe({
  name: 'displayUserPicture'
})
export class DisplayUserPicturePipe implements PipeTransform {
  transform(user: User) {

    if (user == null || user === undefined) {
      return 'images/user2.jpg';
    }

    if (user.profile != null && !(user.profile === undefined) && user.profile.picture != "") {
      return user.profile.picture;
    }
    return 'images/user2.jpg';
  }
}