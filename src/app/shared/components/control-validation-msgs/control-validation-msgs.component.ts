import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  templateUrl: './control-validation-msgs.component.html',
  styleUrls: ['./control-validation-msgs.component.scss'],
})
export class ValidationMessagesComponent implements OnInit {
  @Input() ctrl?: AbstractControl;
  @Input('showError') showError = false;

  ERROR_MESSAGE: any = {
    required: () => 'This field is required',
    minlength: (par: any) => `Min ${par.requiredLength} chars is required`,
    pattern: () => 'Invalid email',
  };

  constructor() {}

  ngOnInit() {}

  listOfErrors(): string[] {
    if (this.ctrl?.errors) {
      return Object.keys(this.ctrl?.errors).map((err) =>
        this.ERROR_MESSAGE[err]
          ? this.ERROR_MESSAGE[err](this.ctrl?.getError(err))
          : ''
      );
    } else {
      return [];
    }
  }
}
