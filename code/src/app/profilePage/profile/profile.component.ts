import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
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
      this.user = response[0]; // Accediendo al primer usuario del array
      console.log('Perfil del usuario cargado:', this.user);
    },
    error => {
      console.error('Error al cargar el perfil del usuario:', error); // Manejo de errores
    }
  );
}





}
