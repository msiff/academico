import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';

// Models
import { User } from '../../../models/userModel';

// Servicios
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit, OnDestroy {
  public users = new Array<User>();
  public status;
  public message;
  public userInfo = new User('', '', '', '', '', '', false, null);
  public newUser = new User('', '', '', '', '', 'teacher', true, null);
  // Estas declaraciones son para el datatable
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<User> = new Subject();
  private chRef: ChangeDetectorRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  // Estas declaraciones son para cerrar el modal desde aca.
  @ViewChild('closeNewUserModal') closeNewUserModal: ElementRef;
  @ViewChild('closeEditUserModal') closeEditUserModal: ElementRef;

  // Lista de alertas para mostrar en la pantalla principal.
  public listaAlertas: any = [];

  constructor(private _userService: UserService, private _router: Router) { }

  ngOnInit() {
    // dt options son las opciones de la datatable.
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      language: {
        emptyTable: 'No hay datos en la tabla',
        info: 'Mostrando desde _START_ al _END_ de _TOTAL_ registros',
        infoEmpty: 'Mostrando 0 de 0 en 0 registros',
        lengthMenu: 'Mostrar _MENU_ registros',
        search: 'Buscar',
        zeroRecords: 'No hay coincidencias con la busqueda',
        paginate: {
          first: '',
          previous: 'Anterior',
          next: 'Siguiente',
          last: ''
        }
      }
    };
    this.getUsers();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  // Obtiene todos los usuarios y con el dt.trigger carga los usuarios a la datatable.
  getUsers() {
    this._userService.getUsers().subscribe(
      response => {
        if (!response.users) {
          this.status = 'err';
          this.message = 'Error al buscar usuarios, vuelve a intentarlo.';
        } else {
          this.users = response.users;
          // this.chRef.detectChanges();
          this.dtTrigger.next();
          // console.log(this.users);
        }
      },
      err => {
        const errorMessage = <any>err;
        if (errorMessage) {
          const body = JSON.parse(err._body);
          this.message = body.message;
          this.status = body.type;
        }
      }
    );
  }

  // Obtiene todos los usuarios pero en vez de actualizar la tabla, la destruye y crea una nueva, de otra forma da
  // eror las datatable.
  getUsersRerender() {
    this._userService.getUsers().subscribe(
      response => {
        if (!response.users) {
          this.status = 'err';
          this.message = 'Error al buscar usuarios, vuelve a intentarlo.';
        } else {
          this.users = response.users;
          this.rerender();
        }
      },
      err => {
        const errorMessage = <any>err;
        if (errorMessage) {
          const body = JSON.parse(err._body);
          this.message = body.message;
          this.status = body.type;
        }
      }
    );
  }

  // carga la info del usuario seleccionado en el modal
  loadInfo(userr: User) {
    this.userInfo._id = userr._id;
    this.userInfo.name = userr.name;
    this.userInfo.surname = userr.surname;
    this.userInfo.alias = userr.alias;
    this.userInfo.state = userr.state;
    this.userInfo.role = userr.role;
    this.userInfo.password = '';
    this.userInfo.createdAt = userr.createdAt;
  }

  // update user
  updateUser() {
    this._userService.updateUser(this.userInfo).subscribe(
      response => {
        if (!response.user) {
          this.status = 'err';
          this.message = 'Error al actualizar el usuario, vuelve a intentarlo';
        } else {
          this.agregarAlerta('success', 'Los datos se guardaron correctamente.');
          this.getUsersRerender();
          this.userInfo = new User('', '', '', '', '', '', false, null);
          this.closeModalEditUser();
        }
      },
      err => {
        const errorMessage = <any>err;
        if (errorMessage) {
          const body = JSON.parse(err._body);
          this.message = body.message;
          this.status = body.type;
        }
      }
    );
  }

  // Este metodo destruye la datatable que habia y crea una nueva actualizada.
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  // metodo para agregar un usuario
  addUser() {
    this._userService.addUser(this.newUser).subscribe(
      response => {
        if (response.type !== 'ok') {
          this.status = 'err';
          this.message = response.message;
        } else {
          this.agregarAlerta('success', response.message);
          this.getUsersRerender();
          this.newUser = new User('', '', '', '', '', 'teacher', true, null);
          this.closeModalNewUser();
        }
      },
      err => {
        const errorMessage = <any>err;
        if (errorMessage) {
          const body = JSON.parse(err._body);
          this.message = body.message;
          this.status = body.type;
        }
      }
    );
  }

  // reset new user, para vaciar los campos del nuevo usuario.
  resetNewUser() {
    this.newUser = new User('', '', '', '', '', 'teacher', true, null);
    this.status = '';
    this.message = '';
  }

  // call this wherever you want to close modal
  private closeModalNewUser(): void {
    this.closeNewUserModal.nativeElement.click();
  }
  // call this wherever you want to close modal
  private closeModalEditUser(): void {
    this.closeEditUserModal.nativeElement.click();
  }

  private agregarAlerta(type, message): void {
    this.listaAlertas.push({
      type: type,
      msg: message,
      timeout: 5000
    });
  }
}
