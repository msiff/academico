import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

// Models
import { Modality } from '../../../models/modalityModel';
import { TipoModality } from '../../../models/tipoModalityModel';
import { User } from '../../../models/userModel';

// Servicios
import { ModalityService } from '../../../services/modality.service';
import { TipoModalityService } from '../../../services/tipoModality.service';
import { UserService } from '../../../services/user.service';

// Modulos externos
import { BsDatepickerConfig, BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-listado-modalidades',
  templateUrl: './listado-modalidades.component.html',
  styles: []
})
export class ListadoModalidadesComponent implements OnInit, OnDestroy {

  public modalitys = new Array<Modality>();
  public tipoModalitysActives = new Array<TipoModality>();
  public usersActive = new Array<User>();
  public status;
  public message;
  public modalityNew = new Modality('', '', '', {} as TipoModality, null, true, new Array<User>(), null);
  public modalityInfo = new Modality('', '', '', {} as TipoModality, null, true, new Array<User>(), null);
  public modalityDelete = new Modality('', '', '', {} as TipoModality, null, true, new Array<User>(), null);

  // lista de danzas
  danzas = ['Infantil', 'Jazz', 'Arabe', 'Clasico', 'Ritmos Latinos'];

  // Estas declaraciones son para el datatable
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<TipoModality> = new Subject();
  private chRef: ChangeDetectorRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  // Estas declaraciones son para cerrar el modal desde aca.
  @ViewChild('closeEditModal') closeEditModal: ElementRef;
  @ViewChild('closeNewModal') closeNewModal: ElementRef;
  @ViewChild('closeDeleteModal') closeDeleteModal: ElementRef;

  // Lista de alertas para mostrar en la pantalla principal.
  public listaAlertas: any = [];

  // Declaro configuraciones para el datepicker elegit solo año
  minMode: BsDatepickerViewMode = 'year';
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private _modalityService: ModalityService, private _tipoModalityService: TipoModalityService,
      private _userService: UserService) { }

  ngOnInit() {
    // opciones del datepicker
    this.bsConfig = Object.assign({}, {
      minMode : this.minMode,
      dateInputFormat: 'YYYY'
    });
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
    this.get();
    this.getTipoModalitysActive();
    this.getUsersActive();
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  // Obtiene los elementos para mostrar en el datatable
  get() {
    this._modalityService.getModalitys().subscribe(
      response => {
        if (!response.modalitys) {
          this.agregarAlerta('danger', response.message);
        } else {
          this.modalitys = response.modalitys;
          this.dtTrigger.next();
          console.log(this.modalitys);
        }
      },
      err => {
        const errorMessage = <any>err;
        if (errorMessage) {
          const body = JSON.parse(err._body);
          this.agregarAlerta('danger', body.message);
        }
      }
    );
  }

  getTipoModalitysActive() {
    this._tipoModalityService.getTipoModalitysActive().subscribe(
      response => {
        if (!response.tipoModalitys) {
          this.agregarAlerta('danger', response.message);
        } else {
          this.tipoModalitysActives = response.tipoModalitys;
        }
      },
      err => {
        const errorMessage = <any>err;
        if (errorMessage) {
          const body = JSON.parse(err._body);
          this.agregarAlerta('danger', body.message);
        }
      }
    );
  }

  getUsersActive() {
    this._userService.getUsersActive().subscribe(
      response => {
        if (!response.users) {
          this.agregarAlerta('danger', response.message);
        } else {
          this.usersActive = response.users;
        }
      },
      err => {
        const errorMessage = <any>err;
        if (errorMessage) {
          const body = JSON.parse(err._body);
          this.agregarAlerta('danger', body.message);
        }
      }
    );
  }

  // Agrega un elemento
  add() {
    this._modalityService.addModality(this.modalityNew).subscribe(
      response => {
        if (response.type !== 'ok') {
          this.status = 'err';
          this.message = response.message;
        } else {
          this.agregarAlerta('success', response.message);
          this.getRerender();
          this.modalityNew = new Modality('', '', '', {} as TipoModality, null, true, new Array<User>(), null);
          this.closeModalNew();
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

  // Updatea el elemento
  update() {
    this._modalityService.updateModality(this.modalityInfo).subscribe(
      response => {
        if (!response.tipoModality) {
          this.status = 'err';
          this.message = response.message;
        } else {
          this.agregarAlerta('success', 'Los datos se guardaron correctamente.');
          this.getRerender();
          this.modalityInfo = new Modality('', '', '', {} as TipoModality, null, true, new Array<User>(), null);
          this.closeModalEdit();
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

  // Obtiene los elementos para mostrar en el datatable pero llama al metodo rerender,
  // se utiliza cuando los elementos de la tabla son modificados y el componente no se recarga.
  getRerender() {
    this._modalityService.getModalitys().subscribe(
      response => {
        if (!response.modalitys) {
          this.agregarAlerta('danger', response.message);
        } else {
          this.modalitys = response.modalitys;
          this.rerender();
        }
      },
      err => {
        const errorMessage = <any>err;
        if (errorMessage) {
          const body = JSON.parse(err._body);
          this.agregarAlerta('danger', body.message);
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

  // Asigno desde el boton eliminar del datatable el objecto que se desea eliminar y lo guardo en memoria
  // para despues ser llamado desde otra funcion en el modal.
  deleteItem(object) {
    object = <TipoModality> object;
    this.modalityDelete = object;
  }

  // Esta funcion se llama desde el boton eliminar del modal eliminar, simplemente ejecuta la accion tomando
  // el elemento en memoria para eliminar.
  delete() {
    this.closeModalDelete();
    this._modalityService.deleteModality(this.modalityDelete).subscribe(
      response => {
        if (!response.fatherDeleted) {
          this.agregarAlerta('danger', response.message);
        } else {
          this.agregarAlerta('success', response.message);
          this.getRerender();
        }
      },
      err => {
        const errorMessage = <any>err;
        if (errorMessage) {
          const body = JSON.parse(err._body);
          this.agregarAlerta('danger', body.message);
        }
      }
    );
  }

  // Carga la info del objeto seleccionado del datatable al objeto para mostrar en el modal.
  loadInfo(object) {
    object = <TipoModality> object;
    this.modalityInfo._id = object._id;
    this.modalityInfo.name = object.name;
    this.modalityInfo.dance = object.dance;
    this.modalityInfo.type = object.type;
    this.modalityInfo.year = object.year;
    this.modalityInfo.state = object.state;
    this.modalityInfo.teachers = object.teachers;
    this.modalityInfo.createdAt = object.createdAt;
  }

  // call this wherever you want to close modal
  private closeModalEdit(): void {
    this.closeEditModal.nativeElement.click();
  }

  private closeModalNew(): void {
    this.closeNewModal.nativeElement.click();
  }

  private closeModalDelete(): void {
    this.closeDeleteModal.nativeElement.click();
  }

  private agregarAlerta(type, message): void {
    this.listaAlertas.push({
      type: type,
      msg: message,
      timeout: 5000
    });
  }

  // Limpia las alertas de los modales
  limpiarAlerts() {
    this.status = '';
    this.message = '';
  }

}
