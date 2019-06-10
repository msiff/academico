import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

// Servicios
import { StudentService } from '../../../services/student.service';
import { FatherService } from '../../../services/father.service';

// Models
import { Student } from '../../../models/studentModel';
import { Father } from '../../../models/fatherModel';

// Componentes
import { AltaPadreComponent } from '../../padres/alta-padre/alta-padre.component';

@Component({
  selector: 'app-editar-alumno',
  templateUrl: './editar-alumno.component.html',
  styles: []
})
export class EditarAlumnoComponent implements OnInit {
  public father = new Father('', '', '', '', '', '', '', null);
  public student = new Student('', '', '', null, '', '', this.father, null, '', null);
  public fathers = new Array<Father>();

  @ViewChild('closeNewFatherModal') closeNewFatherModal: ElementRef;

  // Lista de alertas para mostrar en la pantalla principal.
  public listaAlertas: any = [];

  // Para manejar el componente hij
  @ViewChild('altaPadre') altaPadre: AltaPadreComponent;

  constructor(private _studentService: StudentService, private _fatherService: FatherService,
    private _router: Router) { }

  ngOnInit() {
    if (this._studentService.studentEdit === undefined) {
      this._router.navigate(['/alumnos/listado-alumnos']);
    } else {
      this.student = this._studentService.studentEdit;
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
            this.father = new Father('', '', '', '', '', '', '', null);
          }
        }
      );
    }
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
          this.agregarAlerta('danger', body.message);
        }
      }
    );
  }

  // Esta funcion llama a la funcion creada en el componente alta padre, que da de alta un padre.
  // el padre responde con un event emiter, que lo escuchamos en el onInit. Cuando el responde mostramos alertas
  // y si es positivo recargamos la tabla para obtener el nuevo padre.
  addFather() {
    this.altaPadre.addFather();
  }

  // update Student
  updateStudent() {
    console.log(this.student.birthDate);
    this._studentService.updateStudents(this.student).subscribe(
      response => {
        if (!response.student) {
          this.agregarAlerta('danger', 'Error al actualizar el alumno');
        } else {
          this.agregarAlerta('success', 'Los datos se guardaron correctamente.');
          setTimeout(() => { this._router.navigate(['/alumnos/listado-alumnos']); }, 5000);
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

  private agregarAlerta(type, message): void {
    this.listaAlertas.push({
      type: type,
      msg: message,
      timeout: 5000
    });
  }

  private closeModalNewFather(): void {
    this.closeNewFatherModal.nativeElement.click();
  }

}
