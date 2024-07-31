import { UserEntity } from 'src/user/entities/user.entity';
import { TaskEntity } from './entities/task.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity)
        private taskRepository: Repository<TaskEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {}

    async createTask(userId: any, createTaskDto: CreateTaskDto) {
        let task = new TaskEntity();
        task.title = createTaskDto.title;
        task.description = createTaskDto.description;
        task.status = createTaskDto.status;
        task.duedate = new Date(createTaskDto.duedate);
        task = await this.taskRepository.save(task);

        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['tasks'],
        });
        user.tasks.push(task);
        await this.userRepository.save(user);
        return task;
    }

    async getAllTasks(userId: any) {
        const tasks = await this.taskRepository.find({
            where: { user: userId },
            order: {
                duedate: 'DESC',
            },
        });
        return tasks;
    }

    async findTaskById(userId: any, taskId: string) {
        const task = await this.taskRepository.findOne({
            where: { id: taskId, user: userId },
        });
        if (task) {
            return task;
        }
        return null;
    }

    async updateTask(
        userId: any,
        taskId: string,
        updateTaskDto: UpdateTaskDto,
    ) {
        let updateTask = await this.taskRepository.findOne({
            where: { id: taskId, user: userId },
        });
        updateTask = await this.taskRepository.save({
            ...updateTask,
            ...updateTaskDto,
        });
        if (!updateTask) {
            return null;
        }
        return updateTask;
    }

    async deleteTask(userId: any, taskId: string) {
        const task = await this.taskRepository.findOne({
            where: { id: taskId, user: userId },
        });
        if (!task) {
            return null;
        }
        const deleteResult = await this.taskRepository.remove(task);
        return deleteResult;
    }
}
