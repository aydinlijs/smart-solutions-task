import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { ValidationMessagesComponent } from './components/control-validation-msgs/control-validation-msgs.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    ValidationMessagesComponent,
    CreateUserComponent,
    CreateTaskComponent,
  ],
  providers: [HttpService],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  exports: [
    ValidationMessagesComponent,
    CreateUserComponent,
    CreateTaskComponent,
  ],
})
export class SharedModule {}
