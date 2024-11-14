import { Component, inject, OnInit } from '@angular/core';
import { CurrentUser } from '../../../services/current-user.service';
import { Travel } from '../../../interface/travel.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-travels',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-travels.component.html',
  styleUrls: ['./list-travels.component.css']
})
export class ListTravelsComponent implements OnInit {
  currentUser = inject(CurrentUser);
  currentList : Travel[] | null | undefined = null;
  currentTravel : Travel | null | undefined = null;
  router = inject(Router);

  ngOnInit(): void {
    this.currentList = this.currentUser.getUsuario().travel;
  }

  moreInfoTravel(name: string): void {
    this.currentTravel = this.currentList?.find((current) => current.name === name);
  
    // Navegar a la ruta destino enviando el objeto `currentTravel` en el estado
    this.router.navigate(['/menu_travel/travel_assistant/list_travels/list_one_travel'], {
      state: { travel: this.currentTravel }
    });
  }

  editTravel(name : String) : void {}

  deleteTravel(name : String) : void {}
}
