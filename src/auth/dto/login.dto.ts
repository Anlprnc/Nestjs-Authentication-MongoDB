import { IsString, IsNotEmpty, Length } from "class-validator";

export class LogindDto {
    @IsString()
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