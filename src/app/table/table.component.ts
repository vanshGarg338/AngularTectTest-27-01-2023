import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';
import { IUser } from '../interfaces/iuser';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  myform: FormGroup;
  users: Array<IUser> = new Array<IUser>();
  editUser: boolean = false;
  editIndex: number = -1;
  atInitialLoaded: boolean = true;
  searchText: string = "";

  constructor(private fb: FormBuilder, private apiService: ApiService,
    private _toastr: ToastrService) {
    this.myform = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      number: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.GetUsers();
  }

  OnSubmit() {
    if (!this.editUser)
    {
      this.users.push({
        name: this.myform.get('name')?.value,
        email: this.myform.get('email')?.value,
        number: this.myform.get('number')?.value,
      });
      this.apiService.SaveUsers(this.users);
      this._toastr.success("User addedd successfully!");
    }
    else
    {
      let result = this.apiService.UpdateUser(this.editIndex, this.myform.value);
      this.GetUsers();
      if (result)
      {
        this._toastr.success("User updated successfully!");
      }
      else{
        this._toastr.error("User record not updated successfully!!");
      }
    }
    this.editUser = false;
    this.myform.reset();
  }

  GetUsers() {
    let usersResponse = this.apiService.GetUsers();
    if (usersResponse != null){
      this.users = usersResponse;
      if (this.atInitialLoaded)
      {
        this._toastr.success("Users found!");
      }
      this.atInitialLoaded = false;
    }
    else {
      this.users = new Array<IUser>();
      this._toastr.info("Users not found!");
    }
  }

  OnDeleteUser(index: number){
    let result = this.apiService.DeleteUser(index);
    if (result)
    {
      this._toastr.success("User deleted successfully!");
    }
    else{
      this._toastr.error("User record not deleted successfully!!");
    }
    this.GetUsers();
  }

  OnEditUser(index: number)
  {
    let userResponse = this.apiService.GetUserById(index);
    if (userResponse != null)
    {
      this.editIndex = index;
      this.editUser = true;
      this.myform.reset();
      this.myform.patchValue(
        {
          name: userResponse.name,
          email: userResponse.email,
          number: userResponse.number,
    });
    }
  }
}
