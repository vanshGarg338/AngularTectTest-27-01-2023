import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { IUserResponseModel } from '../interfaces/userresponsemodel';
import { IUserRequestModel } from '../interfaces/iuserrequestmodel';
import { ToastrService } from 'ngx-toastr';
import { Apiresponse } from '../interfaces/apiresponse';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _ApiService: ApiService,
    private _toastrService: ToastrService,
    private _router: Router,
    private _spinnerService: NgxSpinnerService
    ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })

  }

  ngOnInit(): void {

  }


  OnSubmit() {
    localStorage.removeItem("user");
    let user: IUserRequestModel = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };
    this._spinnerService.show();
    this._ApiService.UserLogin(user).subscribe(
      (response: IUserResponseModel) =>
      {
        this._ApiService.ValidateUserToken(response.token).subscribe
        (
          (result: Apiresponse) =>
          {
            this._spinnerService.hide();
            if (result?.data?.status === 200)
            {
              localStorage.setItem("user", JSON.stringify(result));
              this._toastrService.success("Login Successfull!");
              this._router.navigate(['/useractions']);
            }
            else
            {
              this._toastrService.error(result?.message);
            }
          }
          );
      },
      (error) =>
      {
        this._spinnerService.hide();
        this._toastrService.error(error?.error?.message);
      }
    );

  }

}
