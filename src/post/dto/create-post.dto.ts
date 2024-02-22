
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class CreatePostDto{
    @ApiProperty()
    @IsNotEmpty()
    title:string;

    @ApiProperty()
    @IsNotEmpty()
    description:string;

    @ApiProperty()
    thumbnail:string;

    @ApiProperty()
    status:number;
    user:User;
}