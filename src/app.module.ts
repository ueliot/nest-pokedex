import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';


@Module({
  imports: [PokemonModule,
  MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),
  CommonModule,
  SeedModule,
  ]
})
export class AppModule {}
