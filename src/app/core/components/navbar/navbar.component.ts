import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { User } from 'src/app/shared/models/user';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'al-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public homePath = 'home';
  public loginPath = 'login';
  public registerPath = 'register';
  public user: User;
  private subscription: Subscription;
  
  constructor(private router: Router, private layoutService: LayoutService, private authService: AuthService) { }

  ngOnInit(): void {
    this.subscription = 
    this.authService.user$.subscribe(user => this.user = user);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
   }
  public isActive(page: string): boolean {
    return this.router.isActive(page, true);
   }
    
   public navigate(page: string): void {
    this.router.navigate([page]);
   }
   public toggleSidenav() {
    this.layoutService.toggleSidenav();
   }
   public logout() {
    this.authService.logout();
   }
}
