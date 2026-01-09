import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateSectionDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsNumber()
    order?: number;
}
