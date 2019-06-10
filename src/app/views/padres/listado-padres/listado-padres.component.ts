import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

// Models
import { Father } from '../../../models/fatherModel';
import { Student } from '../../../models/studentModel';

// Servicios
import { FatherService } from '../../../services/father.service';

// Componentes
import { AltaPadreComponent } from '../alta-padre/alta-padre.component';

@Component({
  selector: 'app-listado-padres',
  templateUrl: './listado-padres.component.html',
  styles: []
})
export class ListadoPadresComponent implements OnInit, OnDestroy {
  public fathers = new Array<Father>();
  public status;
  public message;
  public fatherInfo = new Father('', '', '', '', '', '', '', null);
  public listhijos: Array<Student>;
  public fatherDelete = new Father('', '', '', '', '', '', '', null);
  // Estas declaraciones son para el datatable
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<Father> = new Subject();
  private chRef: ChangeDetectorRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  // Estas declaraciones son para cerrar el modal desde aca.
  @ViewChild('closeEditFatherModal') closeEditFatherModal: ElementRef;
  @ViewChild('closeNewFatherModal') closeNewFatherModal: ElementRef;
  @ViewChild('closeDeleteFatherModal') closeDeleteFatherModal: ElementRef;

  // Lista de alertas para mostrar en la pantalla principal.
  public listaAlertas: any = [];

  // Para manejar el componente hij
  @ViewChild('altaPadre') altaPadre: AltaPadreComponent;

  constructor(private _fatherService: FatherService) { }

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
    this.getFathers();
    this.altaPadre.emitEventPadreCreado.subscribe(
      res => {
        if (res.status === 'ok') {
          this.agregarAlerta('success', res.message);
          this.getFathersRerender();
          this.closeModalNewFather();
        } else {
          this.agregarAlerta('danger', res.message);
          this.getFathersRerender();
          this.closeModalNewFather();
        }
      }
    );
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  // Obtiene todos los usuarios y con el dt.trigger carga los usuarios a la datatable.
  getFathers() {
    this._fatherService.getFathers().subscribe(
      response => {
        if (!response.fathers) {
          this.status = 'err';
          this.message = 'Error al buscar padres, vuelve a intentarlo.';
          this.agregarAlerta('danger', response.message);
        } else {
          this.fathers = response.fathers;
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

  // update Father
  updateFather() {
    this._fatherService.updateFather(this.fatherInfo).subscribe(
      response => {
        if (!response.father) {
          this.status = 'err';
          this.message = 'Error al actualizar el usuario, vuelve a intentarlo';
        } else {
          this.agregarAlerta('success', 'Los datos se guardaron correctamente.');
          this.getFathersRerender();
          this.fatherInfo = new Father('', '', '', '', '', '', '', null);
          this.closeModalEditFather();
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

  // Delete Father
  deleteFather(father: Father) {
    this.closeModalDeleteFather();
    this._fatherService.deleteFather(father).subscribe(
      response => {
        if (!response.fatherDeleted) {
          this.agregarAlerta('danger', response.message);
        } else {
          this.agregarAlerta('success', response.message);
          this.getFathersRerender();
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

  // Obtiene todos los padres pero en vez de actualizar la tabla, la destruye y crea una nueva, de otra forma da
  // eror las datatable.
  getFathersRerender() {
    this._fatherService.getFathers().subscribe(
      response => {
        if (!response.fathers) {
          this.status = 'err';
          this.message = 'Error al buscar usuarios, vuelve a intentarlo.';
        } else {
          this.fathers = response.fathers;
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

  // Este metodo destruye la datatable que habia y crea una nueva actualizada.
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });

  }

  // call this wherever you want to close modal
  private closeModalEditFather(): void {
    this.closeEditFatherModal.nativeElement.click();
  }

  private closeModalNewFather(): void {
    this.closeNewFatherModal.nativeElement.click();
  }

  private closeModalDeleteFather(): void {
    this.closeDeleteFatherModal.nativeElement.click();
  }

  loadInfo(fatherr: Father) {
    this.fatherInfo._id = fatherr._id;
    this.fatherInfo.name = fatherr.name;
    this.fatherInfo.surname = fatherr.surname;
    this.fatherInfo.adress = fatherr.adress;
    this.fatherInfo.phone1 = fatherr.phone1;
    this.fatherInfo.phone2 = fatherr.phone2;
    this.fatherInfo.details = fatherr.details;
    this.fatherInfo.createdAt = fatherr.createdAt;
    this._fatherService.getHijosPorId(fatherr).subscribe(
      response => {
        this.listhijos = response.hijos;
        console.log(this.listhijos );
      },
      err => {}
    );
  }

  private agregarAlerta(type, message): void {
    this.listaAlertas.push({
      type: type,
      msg: message,
      timeout: 5000
    });
  }

  // Esta funcion llama a la funcion creada en el componente alta padre, que da de alta un padre.
  // el padre responde con un event emiter, que lo escuchamos en el onInit. Cuando el responde mostramos alertas
  // y si es positivo recargamos la tabla para obtener el nuevo padre.
  addFather() {
    this.altaPadre.addFather();
  }

  // Esta funcion carga el padre que se desea eliminar desde el boton del datatable, al objeto que luego el modal concoe.
  fatherToDelete(father: Father) {
    this.fatherDelete = father;
  }
}
