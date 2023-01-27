import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IUserResponseModel } from './interfaces/userresponsemodel';
import { IUserRequestModel } from './interfaces/iuserrequestmodel';
import { IUser } from './interfaces/iuser';
import { ToastrService } from 'ngx-toastr';
import { Apiresponse } from './interfaces/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http:HttpClient, private _toastrService: ToastrService) { }
  headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': `Bearer ` });
  UserLogin(user: IUserRequestModel):Observable<IUserResponseModel>{
    return this.http.post<IUserResponseModel>("https://rueblur.betaplanets.com/wp-json/jwt-auth/v1/token", user)
     .pipe(catchError(this.handleError));
  }

  ValidateUserToken(token: string) : Observable<Apiresponse>
  {
    return this.http.post<Apiresponse>("https://rueblur.betaplanets.com/wp-json/jwt-auth/v1/token/validate", {},
    {headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)})
    .pipe(catchError(this.handleError));
  }

  GetUsers(): Array<IUser> {
    let usersResponse = JSON.parse(localStorage.getItem('userdetails') || '{}');
    if (usersResponse?.length > 0){
      return usersResponse as Array<IUser>;
    }
    else{
      return new Array<IUser>();
    }
  }

  DeleteUser(index: number) : boolean
  {
    let usersResponse = this.GetUsers();
    if (usersResponse != null)
    {
      usersResponse.splice(index, 1);
      this.SaveUsers(usersResponse);
      return true;
    }
    else
    {
      return false;
    }
  }

  SaveUsers(users: Array<IUser>)
  {
    localStorage.removeItem("userdetails");
    if (users?.length > 0)
    {
      localStorage.setItem("userdetails", JSON.stringify(users));
    }
  }

  GetUserById(index: number) : IUser | null
  {
    let usersResponse = this.GetUsers();
    if (usersResponse != null)
    {
      return usersResponse[index];
    }
    else{
      return null;
    }
  }

  UpdateUser(index: number, user: IUser) : boolean
  {
    let usersResponse = this.GetUsers();
    if (usersResponse?.length > 0)
    {
      let userResponse = usersResponse[index];
      userResponse.name = user.name;
      userResponse.email = user.email;
      userResponse.number = user.number;
      usersResponse[index] = userResponse;
      this.SaveUsers(usersResponse);
      return true;
    }
    else{
      return false;
    }
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
