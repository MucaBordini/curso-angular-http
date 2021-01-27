import { Component, OnInit, ViewChild } from '@angular/core';

import { CursosService } from '../cursos.service';
import { Curso } from '../curso';
import { empty, Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.css'],
  preserveWhitespaces: true,
})
export class CursosListaComponent implements OnInit {
  cursos$: Observable<Curso[]>;
  error$ = new Subject<boolean>();

  deleteModalRef: BsModalRef;
  @ViewChild('deleteModal') deleteModal;

  cursoSelecionado: Curso;

  constructor(
    private service: CursosService,
    private alertService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    //this.service.list()
    //.subscribe(dados => this.cursos = dados);

    this.onRefresh();
  }

  onRefresh() {
    this.cursos$ = this.service.list().pipe(
      catchError((error) => {
        console.error(error);
        //this.error$.next(true);
        this.handleError();
        return empty();
      })
    );
    // this.service.list().subscribe(
    //   dados => console.log(dados),
    //   error => console.error(error),
    //   () => console.log('Observable completo')
    // );
  }

  handleError() {
    this.alertService.showAlertDanger('Erro ao carregar os cursos!');
  }

  onEdit(id) {
    this.router.navigate(['editar', id], { relativeTo: this.route });
  }

  onDelete(curso) {
    this.cursoSelecionado = curso;
    this.deleteModalRef = this.modalService.show(this.deleteModal, {
      class: 'modal-sm',
    });
  }

  onConfirmDelete() {
    this.service.remove(this.cursoSelecionado.id).subscribe(
      (success) => {
        this.onRefresh();
        this.deleteModalRef.hide();
      },
      (error) => {
        this.deleteModalRef.hide();
        this.alertService.showAlertDanger(
          `Erro ao deletar curso ${this.cursoSelecionado.nome}!`
        );
      }
    );
  }

  onDeclineDelete() {
    this.deleteModalRef.hide();
  }
}
