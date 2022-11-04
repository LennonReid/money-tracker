import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
  TransactionItemComponent,
  TransactionService,
} from '@monic/libs/transaction';

@Component({
  imports: [CommonModule, IonicModule, TransactionItemComponent],
  selector: 'monic-trans',
  standalone: true,
  template: `
    <ion-content>
      <ion-list>
        <monic-transaction-item
          [transaction]="exp"
          *ngFor="let exp of transactions$ | async"
        ></monic-transaction-item>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button (click)="router.navigate(['trans-edit'])" side="end">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
})
export class TransPage implements OnInit {
  transactions$ = this.dataService.getTransactions().pipe();

  constructor(private dataService: TransactionService, public router: Router) {}

  ngOnInit() {}
}
