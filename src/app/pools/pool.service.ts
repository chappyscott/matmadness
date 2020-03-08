import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Pool } from './pool';


@Injectable({
  providedIn: 'root'
})
export class PoolService {
  private poolsUrl = 'api/pools';

  constructor(
    private http: HttpClient,
    ) { 
}  

  getPools(): Observable<Pool[]> {
    return this.http.get<Pool[]>(this.poolsUrl)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        tap(data => console.log(data.map(obj=>obj.poolName)),
        
        catchError(this.handleError)
        )
      );
  }
  
  getPoolNames(): Observable<Pool[]> {
    return this.http.get<any[]>(this.poolsUrl)
      .pipe(
        map(data=>data.map(obj=>obj.poolName)),
        catchError(this.handleError)
        );
      
  }
  getPool(id: number): Observable<Pool> {
    console.log('In Pool');
    if (id === 0) {
      return of(this.initializePool());
      console.log('Init Pool');
    }
    const url = `${this.poolsUrl}/${id}`;
    console.log(url);
    return this.http.get<Pool>(url)
      .pipe(
        tap(data => console.log('getPool: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createPool(pool: Pool): Observable<Pool> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    pool.id = null;  //DOES NOT HAVE A ID???????????
    return this.http.post<Pool>(this.poolsUrl, pool, { headers })
      .pipe(
        tap(data => console.log('createPool: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deletePool(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.poolsUrl}/${id}`;
    return this.http.delete<Pool>(url, { headers })
      .pipe(
        tap(data => console.log('deletePool: ' + id)),
        catchError(this.handleError)
      );
  }

  updatePool(pool: Pool): Observable<Pool> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.poolsUrl}/${pool.id}`;
    return this.http.put<Pool>(url, pool, { headers })
      .pipe(
        tap(() => console.log('updatePool: ' + pool.id)),
        // Return the pool on an update
        map(() => pool),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initializePool(): Pool {
    // Return an initialized object
    return {
        id: 0,
        poolName: '',
        poolDeadlineDate: '',
        poolDeadlineTime: '',
        poolImageUrlBackground: '', 
        poolImageUrlMain: '',
        poolType: '',
        poolPaymentBreakdown: '',
        poolEntryAmount: '',
        poolTotalEntriesAllowed: null,
        poolOrganizer: '',
        poolOrganizerPhone: '',
        poolDeadlineEpoch: '',
        eventLinkId: 0
    };
  }

}
