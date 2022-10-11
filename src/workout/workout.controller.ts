import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exception.filter';
import { ResponseHandler } from 'src/common/responseHandler';
import { CreateExerciseDTO, DragAndDropWorkoutDTO } from './dto';
import { WorkoutService } from './workout.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetWorkoutsEntity } from './SwaggerEntities';

@UseFilters(HttpExceptionFilter)
@ApiTags('Training Session')
@Controller()
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Get('workouts/import-data')
  @ApiOperation({ summary: 'Import Example Data' })
  async importData(): Promise<any> {
    return this.workoutService.importData();
  }

  @Get('workouts')
  @ApiOperation({ summary: 'Get All Workout Sessions' })
  @ApiOkResponse({
    description: 'Successfully',
    type: GetWorkoutsEntity,
  })
  async getWorkouts(): Promise<ResponseHandler> {
    return this.workoutService.getWorkouts();
  }

  @Patch('workout/dragAndDrop')
  @ApiOperation({
    summary: 'Update Workout Session by using drag-and-drop gestures',
  })
  async dragAndDropWorkout(
    @Body() dragAndDropWorkout: DragAndDropWorkoutDTO,
  ): Promise<ResponseHandler> {
    return this.workoutService.dragAndDropWorkout(dragAndDropWorkout);
  }

  @Post('workout/:id/exercise/create')
  @ApiOperation({ summary: 'Create new exercise' })
  async createExercise(
    @Param('id') id: number,
    @Body() createExercise: CreateExerciseDTO,
  ): Promise<ResponseHandler> {
    return this.workoutService.createExercise(id, createExercise);
  }
}
