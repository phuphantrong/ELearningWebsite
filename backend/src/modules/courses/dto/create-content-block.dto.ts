import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateContentBlockDto {
    @IsNotEmpty()
    @IsString()
    type: string; // 'TEXT' | 'CODE' | 'NOTE' | 'IMAGE' | 'VIDEO'

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsNumber()
    order?: number;

    @IsOptional()
    metadata?: any;
}
