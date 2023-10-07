import { IsString, IsNotEmpty, Length, IsEmail } from "class-validator";

export class AuthdDto {
    @IsString()
    @IsNotEmpty({
        message: "Required field please fill in",
    })
    name: string;

    @IsString()
    @IsNotEmpty({
        message: "Required field please fill in",
    })
    surname: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty({
        message: "Required field please fill in",
    })
    email: string;

    @IsString()
    @IsNotEmpty({
        message: "Required field please fill in",
    })  
    @Length(6, 25, {
        message: "Password must be between 6 and 25 characters",
    })
    password: string
}