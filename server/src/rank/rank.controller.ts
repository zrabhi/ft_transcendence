import { Controller, Get, UseGuards } from '@nestjs/common';
import { RankService } from './rank.service';
import { JwtAuthGuard } from '../auth/Guards/AuthGurad';

@Controller('api')
export class RankController {
    constructor(private rankService: RankService) { }
    
    @UseGuards(JwtAuthGuard)
    @Get('/rank/')
    async getRank(){
        return await this.rankService.getUsersRank();
    }
}
