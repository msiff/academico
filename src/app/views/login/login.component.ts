import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Modelos
import { User } from '../../models/userModel';

// Servicios
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public user: User;
  public identity;
  public status;
  public message;

  constructor(private _router: Router, private _userService: UserService) {
    this.user = new User('', '', '', '', '', '', false, null);
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    if (this.identity !== '') {
      this._router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    // Loguear al usuario!
    this._userService.loginUser(this.user).subscribe(
      response => {
        if (!response.user || !response.user._id) {
          this.status = 'err';
          this.message = 'No se pudo iniciar sesion, intente nuevamente.';
        } else {
          this.identity = response.user;
          sessionStorage.setItem('identity', JSON.stringify(this.identity));
          this._router.navigate(['/home']);
        }
      },
      err => {
        const errorMessage = <any>err;
        if (errorMessage) {
          const body = JSON.parse(err._body);
          this.message = body.message;
          if (body.type) {
            this.status = body.type;
          }
        }
      }
    );
  }
}
