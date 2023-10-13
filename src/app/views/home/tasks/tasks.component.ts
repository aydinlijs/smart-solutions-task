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
import { CreateTaskComponent } from 'src/app/shared/components/create-task/create-task.component';
import { Task } from 'src/app/shared/models/task';
import { User } from 'src/app/shared/models/user';

export interface TableElement {
  email: string;
  id: string;
  password: string;
  isAdmin: boolean;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  private searchTerm = new Subject<string>();

  displayedColumns: string[] = [
    'title',
    'description',
    'status',
    'date',
    'assignees',
    'delete',
  ];
  dataSource: Task[] = [];
  taskList: Task[] = [];
  users: User[] = [];
  firestore: Firestore = inject(Firestore);

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.searchTerm
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.dataSource = this.taskList.filter((t) => t.title.includes(term));
      });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.next(input.value);
  }

  ngOnInit() {
    this.getTasks();
  }

  getTasks = async () => {
    const organizationId = this.authService.getAuthMeta().organizationId;
    const q = query(
      collection(this.firestore, 'tasks'),
      where('organizationId', '==', organizationId)
    );
    const tableData: Task[] = [];
    const querySnapshot = await getDocs(q);
    // using 'forEach' since 'map' does not exist on 'QuerySnapshot'
    querySnapshot.forEach((docElement: any) => {
      const data = docElement.data();
      tableData.push({
        ...data,
        id: docElement.id,
      });
    });
    this.dataSource = tableData;
    this.taskList = tableData;
  };

  handleTaskDeletion(id: string) {
    const docRef = doc(this.firestore, `tasks/${id}`);
    deleteDoc(docRef).then(() => {
      this.getTasks();
      this.toastr.success('', 'The task just got deleted.');
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateTaskComponent, {});

    dialogRef.afterClosed().subscribe(this.getTasks);
  }
}
