import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    // Inscription d'un user
    async register(registerPayload: { firstname: string; lastname: string; email: string; password: string; imageUrl: string; }) {
        const existingUser = await this.usersService.findOneByEmail(registerPayload.email);
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(registerPayload.password, saltOrRounds);

        const user = await this.usersService.create({
            ...registerPayload,
            password: hashedPassword,
        });

        return this.login(user.email, registerPayload.password)
    }

    // Connexion d'un user
    async login(email: string, pass: string): Promise<any> {

        const user = await this.usersService.findOneByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Email doesn\'t exist');
        }

        // Compare le mot de passe fourni avec le hash stocké dans la BDD
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('The password is incorrect');
        }

        // Si les mots de passe correspondent, génère et retourne le token
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
