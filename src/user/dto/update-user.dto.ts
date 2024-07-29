import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsDateString,
} from 'class-validator';
import { Exclude } from 'class-transformer';

export class UpdateUserDTO {
    @ApiProperty()
    @IsOptional()
    @Exclude()
    id?: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    username: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    password?: string;

    @Exclude()
    @IsOptional()
    @IsDateString()
    @ApiProperty({ required: false })
    createdAt?: string;

    @Exclude()
    @IsOptional()
    @IsDateString()
    @ApiProperty({ required: false })
    updatedAt?: string;
}
