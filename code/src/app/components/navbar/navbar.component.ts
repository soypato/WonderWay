import { Component, inject, OnInit } from '@angular/core';
import { CurrentUser } from '../../services/current-user.service';
import { Unsubscribable } from 'rxjs';
import { User } from '../../interface/user.interface';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  currentUserService = inject(CurrentUser);
  userService = inject(UserService);
  currentUser: string = '';
  miPerfil : string | null = null;

  ngOnInit() : void
  {
    this.currentUser = this.currentUserService.getUsuario();
    this.userService.getUserProfile(this.currentUser).subscribe(
      {
        next: (user: User) => {
          this.miPerfil = user.name;
        }
      }
    );
  }
}
