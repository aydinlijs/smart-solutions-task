import { Component, Inject, OnInit } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/user';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  submitted = false;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firestore: Firestore,
    public dialogRef: MatDialogRef<CreateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getUsers();
  }

  getUsers = async () => {
    const orgId = this.authService.getAuthMeta().organizationId;
    const q = query(
      collection(this.firestore, 'users'),
      where('organizationId', '==', orgId)
    );
    const querySnapshot = await getDocs(q);
    // using 'forEach' since 'map' does not exist on 'QuerySnapshot'
    querySnapshot.forEach((docElement: any) => {
      this.users.push(docElement.data());
    });
  };

  initForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(6)]],
      description: ['', [Validators.required, Validators.minLength(6)]],
      status: ['', [Validators.required]],
      assignee: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });
  }

  getErrorMessage(key: string) {
    const control = this.formControls[key];
    if (control.hasError('required')) return 'Please provide a value';

    return control.hasError('minLength') ? 'Please provide a longer value' : '';
  }

  get formControls() {
    return this.form.controls;
  }

  close(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.form.valid) {
      const users = this.users.filter((u) =>
        this.form.value.assignee.includes(u.userId)
      );
      const organizationId = this.authService.getAuthMeta().organizationId;
      addDoc(collection(this.firestore, 'tasks'), {
        ...this.form.value,
        organizationId,
        assignees: users.map((u) => `${u.firstName} ${u.lastName}`).join(', '),
      }).then(() => {
        this.form.reset();
        this.dialogRef.close();
      });
    }
  }
}
