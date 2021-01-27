import { CursosService } from './../cursos.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-cursos-form',
  templateUrl: './cursos-form.component.html',
  styleUrls: ['./cursos-form.component.css'],
})
export class CursosFormComponent implements OnInit {
  form: FormGroup;

  submitted = false;

  constructor(
    private fb: FormBuilder,
    private cursoService: CursosService,
    private modal: AlertModalService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    const curso = this.route.snapshot.data['curso']

    this.form = this.fb.group({
      id: [curso.id],
      nome: [
        curso.nome,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250),
        ],
      ],
    });
  }

  hasError(campo: string) {
    return this.form.get(campo).errors;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.form.value);
    if (this.form.valid) {

      let msgSucesso = 'Criado com sucesso!';
      let msgErro = 'Erro ao criar curso, tente novamente.';

      if (this.form.value.id) {
        msgSucesso = 'Atualizado com sucesso!';
        msgErro = 'Erro ao atualizar curso, tente novamente.';
      }

      this.cursoService.save(this.form.value).subscribe(
        (success) => {
          this.modal.showAlertSuccess(msgSucesso);
          this.location.back();
        },
        (error) =>
          this.modal.showAlertDanger(msgErro),
      )
    }
  }

  onCancel() {
    this.submitted = false;
    this.form.reset();
  }
}
