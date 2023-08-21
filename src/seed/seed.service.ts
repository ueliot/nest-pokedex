import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';


@Injectable()
export class SeedService {

  constructor ( private readonly pokemonService: PokemonService ){}
  private readonly axios: AxiosInstance = axios;   //para saber y se vea esta dependencia  
  private  pokemon: CreatePokemonDto;

  async executedSeed(){
    const {data}= await axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=65');
    data.results.forEach( (poke) => {
      const segments = poke.url.split('/');
      const no = +segments[segments.length-2];      
      this.pokemon = {
        name: poke.name , 
        no: no
      };
      console.log(this.pokemon);
      this.pokemonService.create(this.pokemon)

    } )
    return data.results;
  }  
}
