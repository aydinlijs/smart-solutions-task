import { Injectable, NgZone, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  firestore: Firestore = inject(Firestore);

  constructor(
    private auth: Auth,
    private router: Router,
    public ngZone: NgZone
  ) {
    onAuthStateChanged(this.auth, (user: any) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', 'null');
      }
    });
  }

  //get Authenticated user from Local Storage
  getAuthLocal() {
    const token = localStorage.getItem('user');
    const user = JSON.parse(token as string);
    return user;
  }

  getAuthMeta() {
    const token = localStorage.getItem('user-meta');
    const meta = JSON.parse(token as string);
    return meta;
  }

  get isUserAdmin(): boolean {
    return this.getAuthMeta().isAdmin;
  }

  get isLoggedIn(): boolean {
    const token = localStorage.getItem('user');
    const user = JSON.parse(token as string);
    return user !== null ? true : false;
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((result) => result.user)
      .catch((error) => {
        window.alert(error.message);
      });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(async (result: any) => {
        const q = query(
          collection(this.firestore, 'users'),
          where('userId', '==', result.user.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docElement: any) => {
          const data = docElement.data();
          this.userData = { ...result.user, ...data };
          localStorage.setItem('user-meta', JSON.stringify(data));
        });
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  logout() {
    signOut(this.auth).then(() => this.router.navigate(['/']));
  }
}
