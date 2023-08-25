import { AuthGuard } from "@nestjs/passport";

export class FtGurad extends AuthGuard('42')
{}