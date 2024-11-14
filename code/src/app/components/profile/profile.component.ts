import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { CurrentUser } from '../../services/current-user.service';
import { User } from '../../interface/user.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] 
})

export class ProfileComponent implements OnInit {
  
  userId : Number | null | undefined ; // el ID del usuario actual
  currentUserService = inject(CurrentUser);
  user : User | null | undefined;

  ngOnInit(): void {
    this.userId = this.currentUserService.getUsuario();
    this.userService.getUserProfile(Number(this.userId)).subscribe({
      next: (res) => {
        this.user = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  logout() : void
  {
    this.currentUserService.logout();
  }

  constructor(private userService: UserService) {}





}
