import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Req,
    Res,
    HttpStatus,
    Put,
    HttpException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Response } from 'express';

@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @UseGuards(JwtAuthGuard)
    @Post('register')
    async create(
        @Body() createTaskDto: CreateTaskDto,
        @Req() req,
        @Res() res: Response,
    ) {
        const task = await this.taskService.createTask(
            req.user.id,
            createTaskDto,
        );
        if (task) {
            return res.status(HttpStatus.CREATED).json({
                message: 'Task created with successful',
                task: task,
                success: true,
            });
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error 500: Internal Server Error',
            success: false,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('list')
    async getAllTasks(@Req() req, @Res() res: Response) {
        const tasks = this.taskService.getAllTasks(req.user.id);
        if (tasks) {
            return res.status(HttpStatus.OK).json({
                tasks: tasks,
                success: true,
            });
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error 500: Internal Server Error',
            success: false,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('list/:id')
    async getOneTask(
        @Param('id') taskId: number,
        @Res() res: Response,
        @Req() req,
    ) {
        const task = await this.taskService.findTaskById(req.user.id, taskId);
        if (task) {
            return res.status(HttpStatus.OK).json({
                task: task,
                success: true,
            });
        }
        throw new HttpException(
            'Error 400 Bad Request: Task not found or your user does not have this task',
            HttpStatus.BAD_REQUEST,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Put('update/:id')
    async updateOne(
        @Param('id') taskId: number,
        @Body() updateTaskDto: UpdateTaskDto,
        @Res() res: Response,
        @Req() req,
    ) {
        const task = await this.taskService.updateTask(
            req.user.id,
            taskId,
            updateTaskDto,
        );
        if (task) {
            return res.status(HttpStatus.OK).json({
                message: 'Delete task successfully',
                task: task,
                success: true,
            });
        }
        throw new HttpException(
            'Error 400 Bad Request: Task not found or your user does not have this task',
            HttpStatus.BAD_REQUEST,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    async removeOne(
        @Param('id') taskId: number,
        @Res() res: Response,
        @Req() req,
    ) {
        const task = await this.taskService.deleteTask(req.user.id, taskId);
        if (task) {
            return res.status(HttpStatus.OK).json({
                message: 'Delete task successfully',
                task: task,
                success: true,
            });
        }
        throw new HttpException(
            'Error 400 Bad Request: Task not found or your user does not have this task',
            HttpStatus.BAD_REQUEST,
        );
    }
}
