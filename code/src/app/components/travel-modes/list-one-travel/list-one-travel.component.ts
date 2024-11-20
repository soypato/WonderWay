import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurant } from '../../../interface/restaurant.interface';
import { Hotel } from '../../../interface/hotel.interface';
import { Flight } from '../../../interface/flight.interface';
import { UserService } from '../../../services/user.service';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

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
      // Mostrar alerta de confirmación
      Swal.fire({
        title: '¿Estás seguro?',
        text: `Estás a punto de borrar el servicio: ${service.name}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Borrar',
        confirmButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // Borrar el servicio si se confirma
          this.travelData.services.splice(index, 1);
  
          // Actualizar el usuario
          this.serviceUser.updateUser(this.user).subscribe({
            next: (res) => {
              Swal.fire({
                title: 'Servicio eliminado',
                text: 'El servicio se eliminó y el usuario fue actualizado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              console.log('Usuario actualizado:', res);
            },
            error: (err) => {
              Swal.fire({
                title: 'Error',
                text: 'Hubo un error al actualizar el usuario.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
              console.error('Error al actualizar el usuario:', err);
            }
          });
        }
      });
    }
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

  addService(type: string): void {
    const state = {
      updatedUser: this.user,  // Usuario actualizado
      travelName: this.travelData.name // Nombre del viaje
    };
  
    // acá declaro un obj con las rutas, ts me da la posibilidad de declarar los tipos de datos
    // por lo que le específico 
    
    const routes: { [key: string]: string } = {
      hotel: '/new-hotel-api',
      restaurant: '/new-restaurant-api',
      flight: '/new-flight-api'
    };
  
    // Verifica si el tipo es válido
    const path = routes[type];
    if (path) {
      this.router.navigate([path], { state }); // ruta correspondiente y paso el estado / la str
    } else {
      console.error(`Tipo de servicio no reconocido: ${type}`);
    }
  }


  print(): void {
    Swal.fire({
      title: 'Generando documento...',
      text: 'Por favor, espera mientras preparamos tu PDF.',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
  
        try {
          this.generatePDF();  
          Swal.fire({
            title: '¡Documento generado!',
            text: 'El archivo fue generado correctamente. Observa tus descargas.',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Reintentar',
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
              this.print(); // Reintentar si el usuario lo solicita
            }
          });
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un problema al generar el PDF. ¿Deseas intentarlo nuevamente?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Reintentar',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.print(); // Reintentar si el usuario lo solicita
            }
          });
        }
      },
    });
  }
  
  generatePDF(): void {
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

    doc.text('Wonder Way', pageWidth / 2, 20, { align: 'center' });

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
        `Ubicación: ${service.location || 'No disponible'}`,
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
      doc.text(
        `Documento no válido como comprobante legal | Página ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Guardar PDF
    const fileName = `WonderWay - ${this.travelData?.name || 'Sin nombre'}.pdf`;
    doc.save(fileName);
  }
  
} 
