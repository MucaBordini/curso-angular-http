import { AlertModalComponent } from './../../shared/alert-modal/alert-modal.component';
import { Component, OnInit } from '@angular/core';

import { CursosService } from '../cursos.service';
import { Curso } from '../curso';
import { empty, Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertModalService } from 'src/app/shared/alert-modal.service';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.css'],
  preserveWhitespaces: true
})
export class CursosListaComponent implements OnInit {

  cursos$: Observable<Curso[]>;
  error$ = new Subject<boolean>();

  constructor(private service: CursosService, private alertService: AlertModalService) { }

  ngOnInit(): void {
    //this.service.list()
    //.subscribe(dados => this.cursos = dados);

    this.onRefresh();

  }

  onRefresh(){
    this.cursos$ = this.service.list()
    .pipe(
      catchError(error => {
        console.error(error);
        //this.error$.next(true);
        this.handleError();
        return empty();
      })
    );
    this.service.list().subscribe(
      dados => console.log(dados),
      error => console.error(error),
      () => console.log('Observable completo')
    );
  }

  handleError(){
    this.alertService.showAlertDanger('Erro ao carregar os cursos!');
  }

}
