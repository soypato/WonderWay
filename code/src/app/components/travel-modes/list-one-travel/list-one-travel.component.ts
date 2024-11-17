import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurant } from '../../../interface/restaurant.interface';
import { Hotel } from '../../../interface/hotel.interface';
import { Flight } from '../../../interface/flight.interface';
import { UserService } from '../../../services/user.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-list-one-travel',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './list-one-travel.component.html',
  styleUrls: ['./list-one-travel.component.css']
})

export class ListOneTravelComponent implements OnInit {
  travelData: any;
  serviceUser = inject(UserService);
  router = inject(Router);
  constructor(private route: ActivatedRoute) { }
  user: any;

  ngOnInit(): void {
    // Usar `history.state` para obtener el estado pasado por `router.navigate()`
    const travel = history.state?.travel;
    this.user = history.state?.user;
    
    if (travel) {
      this.travelData = travel;
    }
  }

  deleteService(service: any): void {
    const index = this.travelData.services.indexOf(service);
    if (index !== -1) {
      this.travelData.services.splice(index, 1);
    }
    console.log(this.user);

    // Actualizar el usuario
    this.serviceUser.updateUser(this.user).subscribe({
      next: (res) => {
        console.log('Usuario actualizado:', res);
      },
      error: (err) => {
        console.error('Error al actualizar el usuario:', err);
      }
    });
  }

  // Comprobación de tipo para Restaurant
  isRestaurant(service: any): boolean {
    return service && service.type == "restaurant";
  }

  // Comprobación de tipo para Hotel
  isHotel(service: any): boolean {
    return service && service.type == "hotel";
  }

  // Comprobación de tipo para Flight
  isFlight(service: any): boolean {
    return service && service.type == "flight";
  }

  isService(service: any): boolean {
    return this.isFlight(service) || this.isHotel(service) || this.isRestaurant(service);
  }
  addService(type : string) : void
  {
    switch(type)
    {
      case "hotel":
        this.router.navigate(['/new-hotel-api'], {
          state: {
            updatedUser: this.user,   // Pasa el usuario actualizado
            travelName: this.travelData.name // Y el nombre de la lista
          }
        });
        break;
    }
  }


  print(): void {
    const doc = new jsPDF();
  
    // Configurar colores y estilos
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // Fondo general
    doc.setFillColor(250, 250, 250); // Color de fondo (#FAFAFA)
    doc.rect(0, 0, pageWidth, pageHeight, 'F'); // Dibujar fondo
  
    // Encabezado
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor('#0c5163'); // Título en #0c5163
    doc.text('WonderWay', pageWidth / 2, 20, { align: 'center' });
  
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor('#333'); // Subtítulo gris
    doc.text(`Detalles del viaje: ${this.travelData?.name || 'Sin nombre'}`, pageWidth / 2, 30, { align: 'center' });
  
    // Línea separadora
    doc.setDrawColor(200, 200, 200); // Gris claro
    doc.line(10, 35, pageWidth - 10, 35);
  
    // Detalles del viaje (tabla)
    let yPosition = 45; // Posición inicial
    const cellMargin = 5;
    const tableWidth = pageWidth - 20;
  
    // Cabecera de la tabla
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor('#0c5163');
    doc.text('Servicios', 10, yPosition);
    yPosition += 10;
  
    // Iterar servicios
    this.travelData?.services?.forEach((service: any, index: number) => {
      const details = [
        `Servicio: ${service.name || 'Sin nombre'}`,
        `Ubicación: ${service.location || 'Desconocida'}`,
        `Precio: ${service.price ? `$${service.price} USD` : 'N/A'}`,
      ];
  
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor('#000'); // Texto negro
      details.forEach((detail, detailIndex) => {
        doc.text(detail, 15, yPosition + detailIndex * 6);
      });
      yPosition += details.length * 6 + 10; // Espaciado entre servicios
  
      if (yPosition > pageHeight - 30) {
        // Nueva página si se excede el espacio
        doc.addPage();
        yPosition = 20;
      }
    });
  
    // Pie de página con número de página
    const totalPages = doc.internal.pages.length - 1; // Restar 1 porque `pages[0]` es nulo
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i); // Cambiar a la página correspondiente
      doc.setFontSize(10);
      doc.setTextColor('#666');
      doc.text(`Documento no válido como comprobante legal | Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
  
    // Guardar PDF
    doc.save('WonderWay - ' + this.travelData?.name || 'Sin nombre' + ".pdf");
  }
  
} 
