import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { CurrentUser } from '../../services/current-user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] 
})

export class ProfileComponent implements OnInit {
  
  user: any; // Aquí guardaremos la información del usuario
  currentUserService = inject(CurrentUser);
  ngOnInit(): void {
    this.user = this.currentUserService.getUsuario();
  }

  logout() : void
  {
    this.currentUserService.logout();
  }

  constructor(private userService: UserService) {}





}
