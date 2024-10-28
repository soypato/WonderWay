import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormLoginComponent } from './loginPage/form-login/form-login.component';
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormLoginComponent, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'code';
}
