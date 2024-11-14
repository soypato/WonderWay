import { Component, inject, OnInit } from '@angular/core';
import { CurrentUser } from '../../../services/current-user.service';
import { Travel } from '../../../interface/travel.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interface/user.interface';
import { find } from 'rxjs';

@Component({
  selector: 'app-list-travels',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-travels.component.html',
  styleUrls: ['./list-travels.component.css']
})
export class ListTravelsComponent implements OnInit {
  currentUserId : Number | undefined = inject(CurrentUser).getUsuario().id;
  serviceUser = inject(UserService); 
  serverUser : User | null = null;

  // El viaje actual (para cuando vaya al detail)
  currentTravel : Travel[] | null | undefined = null;

  // El del map (para encontrarlo y pasarlo)
  findTravel : Travel | null | undefined = null;

  router = inject(Router);

  ngOnInit(): void {
    this.serviceUser.getUserProfile(Number(this.currentUserId)).subscribe({
      next: (res) => {
        this.serverUser = res; // ahora tiene el usuario
        this.currentTravel = this.serverUser?.travel
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  

  moreInfoTravel(name: string): void {
    this.findTravel = this.currentTravel?.find((current) => current.name === name);

    // Navegar a la ruta destino enviando el objeto `currentTravel` en el estado
    this.router.navigate(['/menu_travel/travel_assistant/list_travels/list_one_travel'], {
      state: { travel: this.findTravel }
    });
  }

  editTravel(name : String) : void {}

  deleteTravel(name : String) : void {}
}
