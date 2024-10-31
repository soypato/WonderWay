import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] 
})
export class ProfileComponent implements OnInit  {
  
  
  user: any; // Aquí guardaremos la información del usuario


  constructor(private userService: UserService) {}


  ngOnInit(): void {
     this.loadUserProfile();
  }


 loadUserProfile(): void {
  this.userService.getUserProfile().subscribe(
    response => {
      this.user = response.results[0]; // Accediendo al primer usuario del array
    },
    error => {
      console.error('Error al cargar el perfil del usuario:', error); // Manejo de errores
    }
  );
}



}
