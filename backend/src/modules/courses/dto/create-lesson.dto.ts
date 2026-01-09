import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateLessonDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    slug: string;

    @IsOptional()
    @IsNumber()
    order?: number;

    @IsOptional()
    @IsString()
    type?: string;
}
