import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Country } from '../../interfaces/country';
import { CountryService } from '../../services/countries.service';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styles: ``
})
export class CountryPageComponent implements OnInit {
  
  public country?: Country;

    constructor( 
      private activateRoute: ActivatedRoute,
      private countryService: CountryService,
      private router: Router
    ) { }
  
    ngOnInit(): void {
      this.activateRoute.params
      .pipe(
        tap( console.log ),
        switchMap( (params) => this.countryService.searchCountryByAlphaCode(params['id']) )
      )
      .subscribe( res => {
        console.log(res)
        if(!res) {
          return this.router.navigateByUrl('');
        }
        console.log(res)
        return this.country = res;
        
        // console.log({params: params['id']})
        // this.countryService.searchCountryByAlphaCode( params['id'] )
        // .subscribe( country => {
        //   console.log({country})
        // })
       // this.searchCountry(params['id']); 
      })
    }

    // searchCountry(code: string) {
    //   this.countryService.searchCountryByAlphaCode(code)
    //   .subscribe( country => {
    //     console.log({country})
    //   })
    // }

}
