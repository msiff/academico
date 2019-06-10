import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// Models
import { Father } from '../../../models/fatherModel';

// Servicios
import { FatherService } from '../../../services/father.service';

@Component({
  selector: 'app-alta-padre',
  templateUrl: './alta-padre.component.html',
  styles: []
})
export class AltaPadreComponent implements OnInit {
  public fatherNew = new Father('', '', '', '', '', '', '', null);

  // Evento a emitir cuando se cree correctamente el padre
  @Output() emitEventPadreCreado: EventEmitter<any> = new EventEmitter();

  constructor(private _fatherService: FatherService) { }

  ngOnInit() {
  }

  // metodo para agregar un padre
  addFather() {
    this._fatherService.addFather(this.fatherNew).subscribe(
      response => {
        if (response.type !== 'ok') {
          // Emito un evento para el componente padre, en este caso es el listado padre, recive un status de error y un mensaje
          // que viene del sv para emitir un error.
          this.emitEventPadreCreado.emit({
            status: 'err',
            message: response.message
          });
        } else {
          // Reseteo el objeto new father y emito un evento indicando que se agrego el objeto, en el componente padre emito una alerta
          // y vuelvo a cargar la lista.
          this.fatherNew = new Father('', '', '', '', '', '', '', null);
          this.emitEventPadreCreado.emit({
            status: 'ok',
            message: 'Se registro correctamente el nuevo padre'
          });
          // this.closeModalNewUser();
        }
      },
      err => {
        const errorMessage = <any>err;
        if (errorMessage) {
          const body = JSON.parse(err._body);
          this.emitEventPadreCreado.emit({
            status: 'err',
            message: body.message
          });
        }
      }
    );
  }

}
