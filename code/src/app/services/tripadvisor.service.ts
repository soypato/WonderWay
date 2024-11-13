import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TripadvisorService {

  constructor() { }
  url = 'https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation';

  

}
