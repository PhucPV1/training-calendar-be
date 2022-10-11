import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from 'src/database/entities/exercises.entity';
import { WorkoutSession } from 'src/database/entities/workoutSession.entity';
import { WorkoutController } from './workout.controller';
import { WorkoutService } from './workout.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutSession, Exercise])],
  controllers: [WorkoutController],
  providers: [WorkoutService],
})
export class WorkoutModule {}
