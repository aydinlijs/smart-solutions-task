import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  userEmail = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userEmail = this.authService.getAuthMeta().email;
  }

  logout() {
    this.authService.logout();
  }
}
