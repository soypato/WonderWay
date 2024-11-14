import { Component, inject, OnInit } from '@angular/core';
import { CurrentUser } from '../../../services/current-user.service';
import { Travel } from '../../../interface/travel.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-travels',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-travels.component.html',
  styleUrl: './list-travels.component.css'
})
export class ListTravelsComponent implements OnInit {
  currentUser = inject(CurrentUser);
  currentList : Travel[] | null | undefined = null;

  ngOnInit(): void {
    this.currentList = this.currentUser.getUsuario().travel;
  }
}
