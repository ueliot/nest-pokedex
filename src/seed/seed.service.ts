import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;   //para saber y se vea esta dependencia

  async executedSeed(){
    const {data}= await axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=65');

    data.results.forEach( ({name, url}) => {

      const segments = url.split('/');
      const no = +segments[segments.length-2];
      console.log({name, no});

    } )
    return data.results;
  }
  
}