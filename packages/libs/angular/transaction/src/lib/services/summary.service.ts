import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ITransaction } from '@monic/libs/types';
import { BehaviorSubject, combineLatest, of, switchMap } from 'rxjs';
import { IOChartFilterType, monthlyChartNames } from './types';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  private ioChartFilterSubject = new BehaviorSubject<IOChartFilterType>('6');
  readonly ioChartData$ = combineLatest([
    this.fireauth.user,
    this.ioChartFilterSubject,
  ]).pipe(
    switchMap(([user, filter]) => {
      const today = new Date();
      const thisYear = today.getFullYear();
      const thisMonth = today.getMonth();
      const startDate = new Date(thisYear, thisMonth - Number(filter), 1);
      const endDate = new Date(thisYear, thisMonth, 1);
      return of(
        this.firestore.collection<ITransaction>('transactions', (ref) =>
          ref
            .where('userId', '==', user?.uid)
            .where('date', '>=', startDate)
            .where('date', '<', endDate)
            .orderBy('date', 'asc')
        )
      );
    }),
    switchMap((db) =>
      db.valueChanges().pipe(
        switchMap((trans) => {
          const months: number[] = [];
          const incomes: number[] = [];
          const outcomes: number[] = [];
          let income = 0;
          let outcome = 0;
          trans.forEach((t, index) => {
            const month = t.date.toDate().getMonth();
            if (!months.includes(month)) {
              if (index > 0) {
                incomes.push(income);
                outcomes.push(outcome);
              }
              months.push(month);
              income = 0;
              outcome = 0;
            }
            const amount = Number(t.amount);
            if (t.type === 'expense') {
              outcome += amount;
            } else {
              income += amount;
            }
          });
          incomes.push(income);
          outcomes.push(outcome);
          return of({
            months: months.map((v) => monthlyChartNames[v]),
            incomes,
            outcomes,
          });
        })
      )
    )
  );
  readonly sum$ = this.fireauth.user.pipe(
    switchMap((userAuth) =>
      of(
        this.firestore.collection<ITransaction>('transactions', (ref) =>
          ref.where('userId', '==', userAuth?.uid)
        )
      )
    ),
    switchMap((db) =>
      db.valueChanges().pipe(
        switchMap((trans) => {
          let sum = 0;
          trans.forEach((t) => {
            const amount = Number(t.amount);
            if (t.type === 'expense') {
              sum -= amount;
            } else {
              sum += amount;
            }
          });
          return of(sum);
        })
      )
    )
  );

  constructor(
    private firestore: AngularFirestore,
    private fireauth: AngularFireAuth
  ) {}

  ioChartFilterChange(filter: IOChartFilterType) {
    this.ioChartFilterSubject.next(filter);
  }
}