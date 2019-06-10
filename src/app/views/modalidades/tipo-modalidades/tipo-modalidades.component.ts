import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

// Models
import { TipoModality } from '../../../models/tipoModalityModel';

// Servicios
import { TipoModalityService } from '../../../services/tipoModality.service';

@Component({
  selector: 'app-tipo-modalidades',
  templateUrl: './tipo-modalidades.component.html',
  styles: []
})
export class TipoModalidadesComponent implements OnInit, OnDestroy {
  public tipoModalitys = new Array<TipoModality>();
  public status;
  public message;
  public tipoModalityNew = new TipoModality('', '', null, true, null);
  public tipoModalityDelete = new TipoModality('', '', null, true, null);
  public tipoModalityInfo = new TipoModality('', '', null, true, null);

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

  constructor(private _tipoModalityService: TipoModalityService) { }

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
    this.get();
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  // Obtiene los elementos para mostrar en el datatable
  get() {
    this._tipoModalityService.getTipoModalitys().subscribe(
      response => {
        if (!response.tipoModalitys) {
          this.agregarAlerta('danger', response.message);
        } else {
          this.tipoModalitys = response.tipoModalitys;
          this.dtTrigger.next();
          this.closeModalNew();
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
    this._tipoModalityService.addTipoModality(this.tipoModalityNew).subscribe(
      response => {
        if (response.type !== 'ok') {
          this.status = 'err';
          this.message = response.message;
        } else {
          this.agregarAlerta('success', response.message);
          this.getRerender();
          this.tipoModalityNew = new TipoModality('', '', null, true, null);
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
    this._tipoModalityService.updateTipoModality(this.tipoModalityInfo).subscribe(
      response => {
        if (!response.tipoModality) {
          this.status = 'err';
          this.message = response.message;
        } else {
          this.agregarAlerta('success', 'Los datos se guardaron correctamente.');
          this.getRerender();
          this.tipoModalityInfo = new TipoModality('', '', null, true, null);
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
    this._tipoModalityService.getTipoModalitys().subscribe(
      response => {
        if (!response.tipoModalitys) {
          this.agregarAlerta('danger', response.message);
        } else {
          this.tipoModalitys = response.tipoModalitys;
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

  // Limpia las alertas de los modales
  limpiarAlerts() {
    this.status = '';
    this.message = '';
  }

  // Asigno desde el boton eliminar del datatable el objecto que se desea eliminar y lo guardo en memoria
  // para despues ser llamado desde otra funcion en el modal.
  deleteItem(object) {
    object = <TipoModality> object;
    this.tipoModalityDelete = object;
  }

  // Esta funcion se llama desde el boton eliminar del modal eliminar, simplemente ejecuta la accion tomando
  // el elemento en memoria para eliminar.
  delete() {
    this.closeModalDelete();
    this._tipoModalityService.deleteTipoModality(this.tipoModalityDelete).subscribe(
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
    this.tipoModalityInfo._id = object._id;
    this.tipoModalityInfo.type = object.type;
    this.tipoModalityInfo.price = object.price;
    this.tipoModalityInfo.state = object.state;
    this.tipoModalityInfo.createdAt = object.createdAt;
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

}
