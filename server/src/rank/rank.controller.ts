import { Controller, Get } from '@nestjs/common';
import { RankService } from './rank.service';

@Controller('api')
export class RankController {
    constructor(private rankService:RankService){}

    @Get('/rank/')
    async getRank(){
        return await this.rankService.getUsersRank();
    }
}
