import { Component, Inject, OnInit } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  hide: boolean = true;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  getErrorMessage(key: string) {
    const control = this.formControls[key];
    if (control.hasError('required')) return 'Please provide a value';

    return control.hasError('pattern') ? 'Not a valid email' : '';
  }

  get formControls() {
    return this.form.controls;
  }

  close(): void {
    this.form.reset();
    this.dialogRef.close();
  }

  save() {
    if (this.form.valid) {
      const { email, password, firstName, lastName } = this.form.value;
      this.authService.register(email, password).then((res: any) => {
        addDoc(collection(this.firestore, 'users'), {
          userId: res.uid,
          organizationId: this.authService.getAuthMeta().organizationId,
          email,
          password,
          firstName,
          lastName,
          isAdmin: false,
        }).then(() => {
          this.form.reset();
          this.dialogRef.close();
        });
      });
    }
  }
}
