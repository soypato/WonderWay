import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors} from '@angular/forms';

@Component({
  selector: 'app-modify-profile',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './modify-profile.component.html',
  styleUrl: './modify-profile.component.css'
})
export class ModifyProfileComponent implements OnInit {
  modifyProfileForm: FormGroup;

  constructor(private fb: FormBuilder) {
     this.modifyProfileForm = this.fb.group({
      name: ['',[Validators.name]],
      email: ['', [Validators.email]],
      newPass: ['', [Validators.required , Validators.minLength(8)]],
      confirmNewPass:['',Validators.required]
    },{ validators: ModifyProfileComponent.passwordMatchValidator });
  }

  ngOnInit(): void {}

  static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPass = control.get('newpassword');
    const confirmNewPass = control.get('confirmPassword');

    if (!newPass || !confirmNewPass) {
      return null;
    }

    return newPass.value === confirmNewPass.value ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.modifyProfileForm.valid) {
      console.log('Formulario enviado', this.modifyProfileForm.value);
      // LOGICA DE LOGIN ACA
    } else {
      console.log('Formulario no válido');
    }
  }



}
