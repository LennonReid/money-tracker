import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  imports: [IonicModule, RouterModule,CommonModule],
  selector: 'monic-home',
  standalone: true,
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(
    public environmentInjector: EnvironmentInjector,
    public router: Router
  ) {}
}
