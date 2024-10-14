import { Injectable } from '@nestjs/common';
import { CARS_SEED } from './data/cars.seed';
import { BRAND_SEED } from './data/brands.seed';

@Injectable()
export class SeedService {

  populateDB() {

    // CARS_SEED
    // BRAND_SEED

    return 'Seed executed';

  }

}
