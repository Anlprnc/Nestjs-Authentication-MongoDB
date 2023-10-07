import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import mongoose from 'mongoose';
  import { TokenSchema, UserSchema } from './schemas';
  import { AuthdDto, LogindDto } from './dto';
  import * as bcrypt from 'bcrypt';
  import { IJwtPayload } from './interface';
  import { JwtService } from '@nestjs/jwt';
  
  @Injectable()
  export class AuthService {
    constructor(
      @InjectModel('Token') private tokenModel: mongoose.Model<TokenSchema>,
      @InjectModel('User') private userModel: mongoose.Model<UserSchema>,
      private jwtService: JwtService,
    ) {}
  
    async userInfo(userId: IJwtPayload) {
        const user = await this.userModel.findById(userId).select("name surname email");

        return user;
    }
  
    async login(dto: LogindDto) {
      const { email, password } = dto;
  
      const user = await this.userModel.findOne({ email });
  
      if (!user) throw new UnauthorizedException('Invalid Credentials');
  
      const comparePassword = await this.compareData(password, user.password);
      if (!comparePassword)
        throw new UnauthorizedException('Invalid Credentials');
  
      let userId = user._id;
      const token = await this.createToken({ userId });
  
      await this.tokenModel.findOneAndUpdate(
        {
          userId: new mongoose.Types.ObjectId(String(userId)),
        },
        {
          $set: {
            token,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
      
      return {
        token,
      };
    }
  
    async register(dto: AuthdDto) {
      const hash = await this.hashData(dto.password);
  
      const userCheck = await this.userModel.findOne({ email: dto.email });
  
      if (userCheck)
        throw new BadRequestException('Email already exists!');
  
      dto.password = hash;
      const newUser = new this.userModel({
        ...dto,
      });
  
      await newUser.save().catch((error) => {
        throw new BadRequestException('Signup failed!');
      });
  
      return {
        result: 'User created successfully!',
      };
    }
  
    async hashData(data: string) {
      return await bcrypt.hash(data, 10);
    }
  
    async compareData(password, comparePassword) {
      return await bcrypt.compare(password, comparePassword);
    }
  
    async createToken(payload: IJwtPayload) {
      const token = await this.jwtService.sign(payload);
  
      return token;
    }
  }