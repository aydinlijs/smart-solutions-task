import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home/home.component';
import { TopbarComponent } from './topbar/topbar.component';
import { UsersComponent } from './users/users.component';

import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';
import { TasksComponent } from './tasks/tasks.component';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [
    HomeComponent,
    UsersComponent,
    TopbarComponent,
    TasksComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MaterialModule,
    RouterModule.forChild(routes),
  ],
})
export class HomeModule {}
