import { Pipe, PipeTransform } from '@angular/core';
import { IUser } from '../interfaces/iuser';

@Pipe({
  name: 'searchUsers'
})
export class SearchUsersPipe implements PipeTransform {

  transform(users: Array<IUser>, searchText: any): any {
    if (!searchText)
    {
      return users;
    }
    searchText = searchText.toLocaleLowerCase();
    return users.filter(it => {
      return it.name.toLocaleLowerCase().includes(searchText);
    });
  }

}
