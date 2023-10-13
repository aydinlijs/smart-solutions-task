import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  email: string = '';
  password: string = '';
  isSignUp: boolean = false;
  submitted: boolean = false;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private fb: FormBuilder,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      orgName: ['', Validators.required],
      phoneNumber: [null, [Validators.required]],
      address: ['', Validators.required],
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

  toggleView() {
    this.isSignUp = !this.isSignUp;
  }

  get formControls() {
    return this.form.controls;
  }

  signIn(event: MouseEvent) {
    event.preventDefault();
    this.authService.login(this.email, this.password).then((res) => {
      console.log(res);
    });
  }

  signUp(event: MouseEvent) {
    event.preventDefault();
    this.submitted = true;
    const organization = { ...this.form.value };

    const { email, password } = this.form.value;
    if (this.form.valid) {
      this.authService.register(email, password).then((res: any) => {
        delete organization.password;
        delete organization.email;

        addDoc(collection(this.firestore, 'organizations'), organization).then(
          (res2) => {
            addDoc(collection(this.firestore, 'users'), {
              userId: res.uid,
              isAdmin: true,
              email,
              password,
              organizationId: res2.id,
            }).then(() => {
              this.toast.success(
                'Please log in with your credentials.',
                'You just signed up!'
              );
              this.isSignUp = false;
            });
          }
        );
      });
    }
  }
}
