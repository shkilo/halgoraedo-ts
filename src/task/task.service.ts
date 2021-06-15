import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProjectService } from '../project/project.service';
import { EntityNotFoundException } from '../common/exceptions/buisness.exception';
import { Task } from './models/task.model';
import { User } from '../user/user.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Comment } from './models/comment.model';
import { Bookmark } from './models/bookmark.model';
import { Project } from '../project/models/project.model';
import { findMaxPosition } from '../common/utils/find-max-position';
import { UpdateChildTaskPositionsDto } from './dto/update-child-task-positions.dto';
import { Sequelize } from 'sequelize';
import { Section } from '../project/models/section.model';

@Injectable()
export class TaskService {
  constructor(
    private readonly conn: Sequelize,
    private readonly projectService: ProjectService,
    @InjectModel(Task)
    private readonly taskModel: typeof Task,
  ) {}

  async gogo() {
    const tasks = await this.taskModel.findAll({
      include: [
        {
          model: Section,
          include: [
            {
              model: Project,
              include: [
                {
                  model: User,
                },
              ],
            },
          ],
        },
      ],
    });

    await Promise.all(
      tasks.map(async (task) => {
        await task.update({
          creatorId: task.section?.project?.creator?.id,
        });
      }),
    );

    const updatedTask = await this.taskModel.findAll();
    console.log(updatedTask.map((e) => e.section).map);
  }

  async create(user: User, taskData: CreateTaskDto): Promise<Task> {
    const section = await this.projectService.findSection(
      user,
      taskData.projectId,
      taskData.sectionId,
    );

    const maxPosition = taskData.parentId
      ? findMaxPosition(
          section.tasks.find((task) => task.id === taskData.parentId),
        )
      : findMaxPosition(section);

    return await this.taskModel.create({
      ...taskData,
      position: maxPosition + 1,
      creatorId: user.id,
      sectionId: section.id,
    });
  }

  async findAll(user: User): Promise<Task[]> {
    return await this.taskModel.findAll({
      include: [
        {
          model: Task,
          as: 'tasks',
          include: ['comments', 'bookmarks'],
          order: ['position', 'ASC'],
        },
        {
          model: Comment,
          order: [['createdAt', 'ASC']],
        },
        {
          model: Bookmark,
          order: [['createdAt', 'ASC']],
        },
        {
          model: Section,
          attributes: ['id', 'title', 'projectId', 'position'],
          include: [
            {
              model: Project,
              attributes: ['creatorId', 'title', 'color'],
            },
          ],
        },
      ],
      where: { creatorId: user.id, parentId: null },
    });
  }

  async findOne(user: User, id: string): Promise<Task> {
    const task = await this.taskModel.findOne({
      include: [
        'tasks',
        { model: Comment, order: [['createdAt', 'ASC']] },
        { model: Bookmark, order: [['createdAt', 'ASC']] },
      ],
      where: { id, creatorId: user.id },
    });

    if (!task) {
      throw new EntityNotFoundException();
    }

    return task;
  }

  async update(user: User, id: string, taskData: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(user, id);
    return await task.update(taskData);
  }

  async updateChildTaskPositions(
    user: User,
    taskId: string,
    positionData: UpdateChildTaskPositionsDto,
  ) {
    const { orderedTasks } = positionData;

    await this.conn.transaction(async (t) => {
      await Promise.all(
        orderedTasks.map(async (id, position) => {
          const eachChildTask = await this.findOne(user, id);
          await eachChildTask.update(
            { position, parentId: taskId },
            { transaction: t },
          );
        }),
      );
    });
  }

  async remove(user: User, id: string): Promise<void> {
    const task = await this.findOne(user, id);
    return await task.destroy();
  }

  /* methods for comment from blow */
  async addComment(user: User, id: string, commentData: CreateCommentDto) {
    const task = await this.findOne(user, id);
    return await task.$create('comment', commentData);
  }

  async findComment(
    user: User,
    taskId: string,
    commentId: string,
  ): Promise<Comment> {
    const task = await this.findOne(user, taskId);
    const comment = task.comments.find(({ id }) => id === commentId);

    if (!comment) {
      throw new EntityNotFoundException();
    }

    return comment;
  }

  async findComments(user: User, id: string): Promise<Comment[]> {
    const task = await this.findOne(user, id);
    return task.comments;
  }

  async updateComment(
    user: User,
    taskId: string,
    commentId: string,
    commentData: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.findComment(user, taskId, commentId);
    return await comment.update(commentData);
  }

  async removeComment(
    user: User,
    taskId: string,
    commentId: string,
  ): Promise<void> {
    const comment = await this.findComment(user, taskId, commentId);
    return await comment.destroy();
  }

  /* methods for bookkmarks from below */
  async addBookmark(
    user: User,
    id: string,
    bookmarkData: CreateBookmarkDto,
  ): Promise<Bookmark> {
    const task = await this.findOne(user, id);
    return await task.$create('bookmark', bookmarkData);
  }

  async findBookmark(
    user: User,
    taskId: string,
    bookmarkId: string,
  ): Promise<Bookmark> {
    const task = await this.findOne(user, taskId);
    const bookmark = task.bookmarks.find(({ id }) => id === bookmarkId);

    if (!bookmark) {
      throw new EntityNotFoundException();
    }

    return bookmark;
  }

  async findBookmarks(user: User, taskId: string): Promise<Bookmark[]> {
    const task = await this.findOne(user, taskId);
    return task.bookmarks;
  }

  async removeBookmark(
    user: User,
    taskId: string,
    bookmarkId: string,
  ): Promise<void> {
    const bookmark = await this.findBookmark(user, taskId, bookmarkId);
    return await bookmark.destroy();
  }
}
