import { Component, inject, OnInit } from '@angular/core';
import { CurrentUser } from '../../services/current-user.service';
import { Unsubscribable } from 'rxjs';
import { User } from '../../interface/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  currentUserService = inject(CurrentUser);
  currentUser: Number | null = null;

  ngOnInit() : void
  {
    this.currentUser = this.currentUserService.getUsuario();
  }

}
