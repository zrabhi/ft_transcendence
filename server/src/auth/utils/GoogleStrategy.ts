import { PassportStrategy } from "@nestjs/passport";
import {Profile, Strategy } from "passport-google-oauth20"
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
{
    constructor(private readonly config: ConfigService)
    {
        super({
            clientID: config.get('GOOGLE_CLIENT_ID'),
            clientSecret: config.get('GOOGLE_CLIENT_SECRET_KEY'),
            callbackURL: config.get('CALL_BACK_URL'),
            scope: ['profile', 'email'],
        })
    }
    
    async validate(accessToken: string, refreshToken: string, profile: Profile)
    {
        // console.log(accessToken);
        // console.log(refreshToken);
        console.log(profile);
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
            refreshToken,
        };
        return user
        
    }
}


