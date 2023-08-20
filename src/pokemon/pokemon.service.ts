import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name =createPokemonDto.name.toLocaleLowerCase();
    
    try {
        const pokemon = await this.pokemonModel.create(createPokemonDto);
        return pokemon;

    } catch (error){
        this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  //Validamos si podria ser ID de mongo, no numero de pokemon o name de pokemon

  async findOne(term: string) {
    let pokemon: Pokemon;
    //si nos viene un numero buscamos de la propiedad no en la BD
    if(!isNaN(+term)){   
      pokemon = await this.pokemonModel.findOne({no: term})
    } 

    //si pokemon no existe y es un ID de mongo entonces buscamos por el ID
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }

    //si pokemon todavia no existe buscamos por el name
    if (!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()});
    }

    //Si no existe el pokemon enviamos NotFoundException de @nest/common
    if (!pokemon)
      throw new NotFoundException( ` Pokemon whit id, name o no "${term}" not found`)
    

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);   
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      
      try{
        await pokemon.updateOne(updatePokemonDto, {new: true});       
        return {...pokemon.toJSON(), ...updatePokemonDto} ;
      } catch (error) {
          this.handleExceptions(error)
      }
      
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id); 
    // await pokemon.deleteOne();

    const { deletedCount } = await this.pokemonModel.deleteOne({_id: id});
    if (deletedCount===0) {
      throw new BadRequestException(`Pokemon whit id "${ id }" not found`)
    }
    return;
  }

  //manejando excepciones no controladas
  private handleExceptions(error: any){
     if (error.code ===11000){
          throw new BadRequestException(
            `Pokemon exist in DB ${JSON.stringify(error.keyValue)}`
          )
        }
        console.log(error);
        throw new InternalServerErrorException(`Can't create Pokemon -  Check server log`);
  }


}
