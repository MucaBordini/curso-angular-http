import { Component, OnInit, ViewChild } from '@angular/core';

import { Curso } from '../curso';
import { EMPTY, empty, Observable, Subject } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Cursos2Service } from '../cursos2.service';

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
    private service: Cursos2Service,
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

    const result$ = this.alertService.showConfirm('Confirmação', 'Tem certeza que seja remover este curso?', 'Cancelar', 'Sim');
    result$.asObservable().pipe(
      take(1),
      switchMap(result => result ? this.service.remove(curso .id) : EMPTY)
    ).subscribe(
      (success) => {
        this.onRefresh();
      },
      (error) => {
        this.alertService.showAlertDanger(
          `Erro ao deletar curso ${this.cursoSelecionado.nome}!`
        );
      }
    )
  }

  onConfirmDelete() {
    this.service.remove(this.cursoSelecionado.id).subscribe(
      (success) => {
        this.onRefresh();
      },
      (error) => {
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
