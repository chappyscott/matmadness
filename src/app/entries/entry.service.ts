import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Entry } from './entry';

//import entry2 from '../assets/entries.json';


@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private entriesUrl = 'api/entries';
  
  constructor(
    private http: HttpClient,
    private http2: HttpClient
    ) { 
}
  

  getEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.entriesUrl)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        tap(data => console.log(data.map(obj=>obj.entryName)),
        
        catchError(this.handleError)
        )
      );
  }
  
  getEntryNames(): Observable<Entry[]> {
    return this.http.get<any[]>(this.entriesUrl)
      .pipe(
        map(data=>data.map(obj=>obj.entryName)),
        catchError(this.handleError)
        );
      
  }
  
  getEntry(id: number): Observable<Entry> {
    console.log('In Entry');
    if (id === 0) {
      return of(this.initializeEntry());
      console.log('Init Entry');
    }
    const url = `${this.entriesUrl}/${id}`;
    console.log(url);
    return this.http.get<Entry>(url)
      .pipe(
        tap(data => console.log('getEntry: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createEntry(entry: Entry): Observable<Entry> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    entry.id = null;  //DOES NOT HAVE A ID???????????
    return this.http.post<Entry>(this.entriesUrl, entry, { headers })
      .pipe(
        tap(data => console.log('createEntry: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteEntry(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.entriesUrl}/${id}`;
    return this.http.delete<Entry>(url, { headers })
      .pipe(
        tap(data => console.log('deleteEntry: ' + id)),
        catchError(this.handleError)
      );
  }

  updateEntry(entry: Entry): Observable<Entry> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.entriesUrl}/${entry.id}`;
    return this.http.put<Entry>(url, entry, { headers })
      .pipe(
        tap(() => console.log('updateEntry: ' + entry.id)),
        // Return the entry on an update
        map(() => entry),
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

  private initializeEntry(): Entry {
    // Return an initialized object
    return {
        id: 0,
        entryUsername: '',
        entryName: '',
        entryPick1: '',
        entryPick2: '',
        entryPick3: '',
        entryPick4: '',
        entryPick5: '',
        entryPick6: '',
        entryPick7: '',
        entryPick8: '',
        entryPick9: '',
        entryPick10: '',
        entryPick11: '',
        entryPick12: '',
        entryPick13: '',
        entryPick14: '',
        entryPick15: '',
        entryPick16: '',
        entryPoints: 0
    };
  }

}
