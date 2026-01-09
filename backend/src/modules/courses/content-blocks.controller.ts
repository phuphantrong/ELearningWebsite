import { Controller, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateContentBlockDto } from './dto/create-content-block.dto';
import { UpdateContentBlockDto } from './dto/update-content-block.dto';

@Controller('api/v1')
export class ContentBlocksController {
    constructor(private readonly coursesService: CoursesService) { }

    @Post('lessons/:lessonId/blocks')
    create(@Param('lessonId') lessonId: string, @Body() createContentBlockDto: CreateContentBlockDto) {
        return this.coursesService.createBlock(lessonId, createContentBlockDto);
    }

    @Patch('blocks/:id')
    update(@Param('id') id: string, @Body() updateContentBlockDto: UpdateContentBlockDto) {
        return this.coursesService.updateBlock(id, updateContentBlockDto);
    }

    @Delete('blocks/:id')
    remove(@Param('id') id: string) {
        return this.coursesService.removeBlock(id);
    }

    @Put('blocks/reorder')
    reorder(@Body() body: { items: { id: string; order: number }[] }) {
        return this.coursesService.reorderBlocks(body.items);
    }
}
