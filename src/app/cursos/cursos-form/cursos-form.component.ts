import { CursosService } from './../cursos.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cursos-form',
  templateUrl: './cursos-form.component.html',
  styleUrls: ['./cursos-form.component.css']
})
export class CursosFormComponent implements OnInit {

  form: FormGroup;

  submitted = false;

  constructor(private fb: FormBuilder, private cursoService: CursosService, private modal: AlertModalService, private location: Location) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]]
    });

  }

  hasError(campo: string){
    return this.form.get(campo).errors;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.form.value)
    if (this.form.valid) {
      console.log('submit');
      this.cursoService.create(this.form.value).subscribe(
        success => {
          this.modal.showAlertSuccess('Criado com sucesso!');
          this.location.back()
      },
        error => this.modal.showAlertDanger('Erro ao criar curso, tente novamente.'),
        () => console.log('request completado.')
      );
    }
  }

  onCancel() {
    this.submitted = false;
    this.form.reset();
  }

}