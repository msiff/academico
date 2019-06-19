import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';

// Models
import { Student } from '../../../models/studentModel';
import { Father } from '../../../models/fatherModel';

// Servicios
import { StudentService } from '../../../services/student.service';
import { FatherService } from '../../../services/father.service';

// Componentes
import { AltaPadreComponent } from '../../padres/alta-padre/alta-padre.component';

@Component({
  selector: 'app-listado-alumnos',
  templateUrl: './listado-alumnos.component.html',
  styles: []
})
export class ListadoAlumnosComponent implements OnInit, OnDestroy {
  public students = new Array<Student>();
  public fathers = new Array<Father>();
  public status;
  public message;
  public father = new Father('', '', '', '', '', '', '', null);
  public student = new Student('', '', '', null, '', '', null, true , 'Femenino', null);

  // Estas declaraciones son para el datatable
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<Student> = new Subject();
  private chRef: ChangeDetectorRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  // Estas declaraciones son para cerrar el modal desde aca.
  @ViewChild('closeNewStudentModal') closeNewStudentModal: ElementRef;
  @ViewChild('closeNewFatherModal') closeNewFatherModal: ElementRef;

  // Lista de alertas para mostrar en la pantalla principal.
  public listaAlertas: any = [];

   // Para manejar el componente hij
   @ViewChild('altaPadre') altaPadre: AltaPadreComponent;

  constructor(private _studentService: StudentService, private _fatherService: FatherService,
    private _router: Router) { }

  ngOnInit() {
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
    this.getStudents();
    this.getFathers();

    // Esta funcion escucha el evento que emite el alta-padre al agregar un nuevo padre!
    this.altaPadre.emitEventPadreCreado.subscribe(
      res => {
        if (res.status === 'ok') {
          this.agregarAlerta('success', res.message);
          this.getFathers();
          this.closeModalNewFather();
          this.father = new Father('', '', '', '', '', '', '', null);
        } else {
          this.agregarAlerta('danger', res.message);
          this.closeModalNewFather();
          this.closeModalNewStudent();
          this.father = new Father('', '', '', '', '', '', '', null);
        }
      }
    );
  }

  ngOnDestroy() {

  }

  // Obtiene todos los usuarios y con el dt.trigger carga los usuarios a la datatable.
  getStudents() {
    this._studentService.getStudents().subscribe(
      response => {
        if (!response.students) {
          this.agregarAlerta('danger', 'No se pudo obtener la lista de alumnos.');
        } else {
          this.students = response.students;
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

  // Obtiene todos los usuarios y con el dt.trigger carga los usuarios a la datatable.
  getFathers() {
    this._fatherService.getFathers().subscribe(
      response => {
        if (!response.fathers) {
        } else {
          this.fathers = response.fathers;
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

  // Resetea los datos del alumno para que no se muestren en el modal
  resetStudent() {
    this.father = new Father('', '', '', '', '', '', '', null);
    this.student = new Student('', '', '', null, '', '', null, true, 'Femenino', null);
  }

  // Agrega un nuevo estudiante!
  addStudent() {
    if (this.student.father._id === '') {
      this.status = 'err';
      this.message = 'Debes seleccionar un padre!';
    } else {
      this._studentService.addStudent(this.student).subscribe(
        response => {
          if (response.type !== 'ok') {
            this.status = 'err';
            this.message = response.message;
          } else {
            this.agregarAlerta('success', response.message);
            this.getStudentsRerender();
            this.resetStudent();
            this.closeModalNewStudent();
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
  }

  // Obtiene todos los usuarios pero en vez de actualizar la tabla, la destruye y crea una nueva, de otra forma da
  // eror las datatable.
  getStudentsRerender() {
    this._studentService.getStudents().subscribe(
      response => {
        if (!response.students) {
          this.agregarAlerta('danger', 'No se pudo obtener la lista de alumnos.');
        } else {
          this.students = response.students;
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

  // carga la info del usuario seleccionado en el modal
  editStudent(studentt: Student) {
    this._studentService.studentEdit = studentt;
    this._router.navigate(['/alumnos/editar-alumno']);
  }

  // Esta funcion llama a la funcion creada en el componente alta padre, que da de alta un padre.
  // el padre responde con un event emiter, que lo escuchamos en el onInit. Cuando el responde mostramos alertas
  // y si es positivo recargamos la tabla para obtener el nuevo padre.
  addFather() {
    this.altaPadre.addFather();
  }

  // call this wherever you want to close modal
  private closeModalNewStudent(): void {
    this.closeNewStudentModal.nativeElement.click();
  }

  private closeModalNewFather(): void {
    this.closeNewFatherModal.nativeElement.click();
  }

  private agregarAlerta(type, message): void {
    this.listaAlertas.push({
      type: type,
      msg: message,
      timeout: 5000
    });
  }

}
