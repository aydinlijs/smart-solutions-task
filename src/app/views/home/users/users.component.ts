import { Component, OnInit, inject } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CreateUserComponent } from 'src/app/shared/components/create-user/create-user.component';
import { User } from 'src/app/shared/models/user';

export interface TableElement {
  email: string;
  id: string;
  password: string;
  isAdmin: boolean;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  private searchTerm = new Subject<string>();

  displayedColumns: string[] = ['id', 'fullName', 'email', 'status', 'delete'];
  userList: User[] = [];
  dataSource: User[] = [];
  firestore: Firestore = inject(Firestore);

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.searchTerm
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.dataSource = this.userList.filter((u) => u.email.includes(term));
      });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.next(input.value);
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers = async () => {
    const orgId = this.authService.getAuthMeta().organizationId;
    const q = query(
      collection(this.firestore, 'users'),
      where('organizationId', '==', orgId)
    );
    const tableData: User[] = [];
    const querySnapshot = await getDocs(q);
    // using 'forEach' since 'map' does not exist on 'QuerySnapshot'
    querySnapshot.forEach((docElement: any) => {
      tableData.push({ ...docElement.data(), id: docElement.id });
    });
    this.dataSource = tableData;
    this.userList = tableData;
  };

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {});

    dialogRef.afterClosed().subscribe(this.getUsers);
  }

  handleUserDeletion(id: string) {
    const docRef = doc(this.firestore, `users/${id}`);
    deleteDoc(docRef).then(() => {
      this.getUsers();
      this.toastr.success('', 'The user just got deleted.');
    });
  }
}
