import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user';

@Component({
  selector: 'al-sidenav',
  templateUrl: './sidenav.component.html',
  styles: []
})
export class SidenavComponent implements OnInit {
  public prefix = 'app';
  public dashboardPath = `${this.prefix}/dashboard`;
  public planningPath = `${this.prefix}/planning`;
  public workdayPath = `${this.prefix}/workday`;
  public profilPath = `${this.prefix}/profil`;
  public parametersPath = `${this.prefix}/parameters`;

  public subscription: Subscription;
 public user: User;
 
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe(user => 
      this.user = user
     );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
   }
  public navigate(page: string): void {
    this.router.navigate([page]);
    
   }
   public isActive(page: string): boolean {
    return this.router.isActive(page, true);
   }
}
