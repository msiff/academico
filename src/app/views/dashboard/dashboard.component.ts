import { Component, OnInit } from '@angular/core';

// Servicios
import { StudentService } from '../../services/student.service';
import { ModalityService } from '../../services/modality.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  public alumnosActive: Number;
  public alumnosTotal: Number;
  public modalityActive: Number;
  public modalityTotal: Number;

  constructor( private _studentService: StudentService, private _modalityService: ModalityService) { }

  ngOnInit() {
    this.countAlumnos();
    this.countModality();
  }

  countAlumnos() {
    this._studentService.countStudents().subscribe(
      response => {
        if (!response.Total || !response.Activos ) {
        } else {
          this.alumnosTotal = response.Total;
          this.alumnosActive = response.Activos;
        }
      }
    );
  }

  countModality() {
    this._modalityService.modalityCount().subscribe(
      response => {
        if (!response.Total || !response.Activos ) {
        } else {
          this.modalityActive = response.Total;
          this.modalityActive = response.Activos;
        }
      }
    );
  }
}
