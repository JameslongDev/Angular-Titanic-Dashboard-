import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { map, Observable } from 'rxjs';

export interface TitanicPassenger {
  pclass: number;
  survived: number;
  name: string;
  sex: 'male' | 'female';
  age: number | null;
  sibsp: number;
  parch: number;
  ticket: string;
  fare: number;
  cabin: string;
  embarked: 'C' | 'Q' | 'S' | '';
  boat: string;
  body: number | null;
  'home.dest': string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient, private papa: Papa) { }

  
  getTitanicData(): Observable<TitanicPassenger[]> {
    const csvFilePath = 'assets/TitanicDataset.csv';

    return this.http.get(csvFilePath, { responseType: 'text' }).pipe(
      map(csvText => {
        const parsedData = this.papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header: string) => header.trim().replace(/"/g, ''),
        });

        const typedData = (parsedData.data as any[]).map(row => {
          
          const parseNumber = (value: string): number | null => {
            if (value === null || value === undefined || value.trim() === '') {
              return null;
            }
            const num = Number(value);
            return isNaN(num) ? null : num;
          };

          return {
            pclass: parseNumber(row.pclass),
            survived: parseNumber(row.survived),
            name: row.name?.replace(/"/g, '') || '',
            sex: row.sex?.replace(/"/g, '') || '',
            age: parseNumber(row.age),
            sibsp: parseNumber(row.sibsp),
            parch: parseNumber(row.parch),
            ticket: row.ticket?.replace(/"/g, '') || '',
            fare: parseNumber(row.fare),
            cabin: row.cabin?.replace(/"/g, '') || '',
            embarked: row.embarked?.replace(/"/g, '') || '',
            boat: row.boat?.replace(/"/g, '') || '',
            body: parseNumber(row.body),
            'home.dest': row['home.dest']?.replace(/"/g, '') || ''
          };
        });

        return typedData as TitanicPassenger[];
      })
    );
  }

  
}
