import { Injectable } from '@nestjs/common';

import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {

  constructor (
    @InjectModel(Pokemon.name) 
    private readonly pokemonModel: Model<Pokemon>,
    
    private readonly http: AxiosAdapter,
    ){}
 
  async executedSeed(){
    await this.pokemonModel.deleteMany({}); // delete * from pokemons   await para que no continue
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=65');
    const pokemonToInser: {name:string, no: number}[] = [];  //definimos un array donde almacenar pokemons
    data.results.forEach( ({name,url}) => {
        const segments = url.split('/');
        const no = +segments[segments.length-2];         
        pokemonToInser.push({name, no})
    } )   
    this.pokemonModel.insertMany(pokemonToInser);     
  return `seed executed`;
  }  
}
