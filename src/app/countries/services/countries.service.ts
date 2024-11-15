
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Country } from '../interfaces/country';
import { Region } from '../interfaces/regions.interface';

@Injectable({providedIn: 'root'})
export class CountryService {

    private apiUrl: string = 'https://restcountries.com/v3.1/'

    public cacheStore:CacheStore = {
        byCapital: { term: '', countries: [] },
        byRegion: { region: undefined, countries: [] },
        byCountries: { term: '', countries: [] }
    }

    constructor(private httpClient: HttpClient) {
        this.loadFromLocalStorage();
     }

    private saveToLocalStorage() {
        localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
    }

    private loadFromLocalStorage() {
        if( !localStorage.getItem('cacheStore') ) return;
        
        this.cacheStore = JSON.parse( localStorage.getItem('cacheStore')! );
    }

    private getCountryRequest(url:string): Observable<Country[]> {
        return this.httpClient.get<Country[]>(url)
        .pipe(
            catchError( err => of([]) ) 
        );
    }

    searchCountryByAlphaCode( code: string ):Observable<Country | null> {
        return this.httpClient.get<Country[]>(`${this.apiUrl}alpha/${code}`)
        .pipe(
            map( res => res.length > 0 ? res[0] : null ),
            catchError( err => of(null) )
        );
    }
    
    searchCapital( capital: string ):Observable<Country[]> {
        return this.httpClient.get<Country[]>(`${this.apiUrl}capital/${capital}`)
        .pipe(
            tap( countries => this.cacheStore.byCapital = { term: capital, countries } ),
            tap( () => this.saveToLocalStorage() ),
            catchError( err => of([]) )
        );
    }

    searchCountry( term: string ):Observable<Country[]> {
        return this.getCountryRequest(`${this.apiUrl}name/${term}`)
        .pipe(
            tap( countries => this.cacheStore.byCountries = { term, countries } ),
            tap( () => this.saveToLocalStorage() ),
            catchError( err => of([]) )
        );
    }
    
    searchRegion( region: Region ):Observable<Country[]> {
        return this.httpClient.get<Country[]>(`${this.apiUrl}region/${region}`)
        .pipe(
            tap( countries => this.cacheStore.byRegion = { region, countries } ),
            tap( () => this.saveToLocalStorage() ),
            catchError( err => of([]) )
        );
    }
}