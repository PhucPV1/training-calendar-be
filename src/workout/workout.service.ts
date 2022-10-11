import { Injectable } from '@nestjs/common';
import { WorkoutSession } from 'src/database/entities/workoutSession.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Between } from 'typeorm';
import { Exercise } from 'src/database/entities/exercises.entity';
import { IExampleData } from 'src/interfaces/example_data.interface';
import * as moment from 'moment';
import * as _ from 'lodash';
import ErrorResponseHandler, {
  ResponseHandler,
} from 'src/common/responseHandler';
import { getDaysInCurrentWeek } from 'src/utils/getDaysInCurrentWeek';
import { CreateExerciseDTO, DragAndDropWorkoutDTO } from './dto';
import { ErrorException } from 'src/constants/error';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(WorkoutSession)
    private workoutRepository: Repository<WorkoutSession>,
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
  ) {}

  async importData(): Promise<any> {
    const data: IExampleData = {
      workoutSessions: [
        {
          name: 'FULL CHEST & TRICEPS WORKOUT FOR A BIGGER CHEST & BIGGER ARMS',
          date: moment('2022/10/13', 'YYYY-MM-DD')['_d'],
          order: 0,
          id: 1,
        },
        {
          name: 'LEG DAY',
          date: moment('2022/10/14', 'YYYY-MM-DD')['_d'],
          order: 0,
          id: 2,
        },
        {
          name: 'ARM DAY',
          date: moment('2022/10/14', 'YYYY-MM-DD')['_d'],
          order: 1,
          id: 3,
        },
        {
          name: 'WORKOUT 1',
          date: moment('2022/10/15', 'YYYY-MM-DD')['_d'],
          order: 0,
          id: 4,
        },
        {
          name: 'WORKOUT 2',
          date: moment('2022/10/15', 'YYYY-MM-DD')['_d'],
          order: 1,
          id: 5,
        },
        {
          name: 'WORKOUT 3',
          date: moment('2022/10/12', 'YYYY-MM-DD')['_d'],
          order: 0,
          id: 6,
        },
      ],
      exercises: [
        {
          name: 'Bench Press Medicine Ball Power Throw',
          setNumber: 3,
          id: 1,
          setInfo: '50 lbs x 5, 60 lbs x 5, 70 lbs x 2',
          workoutSession: { id: 1 },
        },
        {
          name: 'Exercise B',
          setNumber: 1,
          id: 2,
          setInfo: '40 lbs x 10',
          workoutSession: { id: 1 },
        },
        {
          name: 'Exercise C',
          setNumber: 1,
          id: 3,
          setInfo: '30 lbs x 6',
          workoutSession: { id: 2 },
        },
        {
          name: 'Exercise D',
          setNumber: 1,
          id: 4,
          setInfo: '40 lbs x 5',
          workoutSession: { id: 2 },
        },
        {
          name: 'Exercise E',
          setNumber: 1,
          id: 5,
          setInfo: '50 lbs x 5',
          workoutSession: { id: 2 },
        },
        {
          name: 'Exercise F',
          setNumber: 1,
          id: 6,
          setInfo: '60 lbs x 6',
          workoutSession: { id: 3 },
        },
      ],
    };

    await this.workoutRepository
      .createQueryBuilder()
      .insert()
      .into(WorkoutSession)
      .values(data.workoutSessions)
      .execute();

    await this.exerciseRepository
      .createQueryBuilder()
      .insert()
      .into(Exercise)
      .values(data.exercises)
      .execute();

    return 'Import success fully';
  }

  async getWorkouts(): Promise<ResponseHandler> {
    try {
      const daysInCurrentWeek = getDaysInCurrentWeek();
      const daysOfTheMonth = _.chain(daysInCurrentWeek)
        .map((data) => data.dayOfTheMonth)
        .value();

      const workouts = await this.workoutRepository.find({
        where: {
          date: In([...daysOfTheMonth]),
        },
        relations: ['exercises'],
        order: { order: 'ASC' },
      });

      const result = daysInCurrentWeek.map((day) => {
        workouts.forEach((workout) => {
          if (moment(workout.date).format('YYYY/MM/DD') === day.dayOfTheMonth) {
            day.workoutSessions.push({
              id: workout.id,
              name: workout.name,
              order: workout.order,
              exercises: workout.exercises,
            });
          }
        });
        return day;
      });
      return new ResponseHandler(true, result, 200);
    } catch (error) {
      ErrorResponseHandler(error);
    }
  }

  async dragAndDropWorkout(
    dragAndDropWorkout: DragAndDropWorkoutDTO,
  ): Promise<ResponseHandler> {
    try {
      const sourceOrder = dragAndDropWorkout.source.order;
      const sourceDate = dragAndDropWorkout.source.date;
      const destOrder = dragAndDropWorkout.destination.order;
      const destDate = dragAndDropWorkout.destination.date;

      if (sourceDate === destDate) {
        this.internalDnD(sourceOrder, sourceDate, destOrder);
      } else {
        this.externalDayDnD(sourceOrder, sourceDate, destOrder, destDate);
      }

      return new ResponseHandler(true, 'Successfully', 200);
    } catch (error) {
      ErrorResponseHandler(error);
    }
  }

  /* internal day Drag n Drop */
  async internalDnD(sourceOrder, sourceDate, destOrder) {
    if (sourceOrder < destOrder && destOrder - sourceOrder == 1) {
      let [sourceWorkout, destWorkout] = await this.workoutRepository.find({
        where: {
          date: moment(sourceDate, 'YYYY/MM/DD')['_d'],
          order: In([sourceOrder, destOrder]),
        },
        order: { order: 'ASC' },
      });
      await this.workoutRepository.manager.transaction(async (transaction) => {
        await Promise.all([
          transaction.save(WorkoutSession, {
            ...sourceWorkout,
            order: destOrder,
          }),
          transaction.save(WorkoutSession, {
            ...destWorkout,
            order: sourceOrder,
          }),
        ]);
      });
    }

    if (destOrder < sourceOrder && sourceOrder - destOrder == 1) {
      let [destWorkout, sourceWorkout] = await this.workoutRepository.find({
        where: {
          date: moment(sourceDate, 'YYYY/MM/DD')['_d'],
          order: In([sourceOrder, destOrder]),
        },
        order: { order: 'ASC' },
      });
      await this.workoutRepository.manager.transaction(async (transaction) => {
        await Promise.all([
          transaction.save(WorkoutSession, {
            ...sourceWorkout,
            order: destOrder,
          }),
          transaction.save(WorkoutSession, {
            ...destWorkout,
            order: sourceOrder,
          }),
        ]);
      });
    }

    if (sourceOrder < destOrder && destOrder - sourceOrder > 1) {
      const workouts = await this.workoutRepository.find({
        where: {
          date: moment(sourceDate, 'YYYY/MM/DD')['_d'],
          order: Between(sourceOrder, destOrder),
        },
        order: { order: 'ASC' },
      });
      const destWorkout = { ...workouts.shift(), order: destOrder };
      const newOtherWorkout = workouts.map((workout) => {
        --workout.order;
        return workout;
      });

      await this.workoutRepository.manager.transaction(async (transaction) => {
        const promises = [];
        promises.push(transaction.save(WorkoutSession, destWorkout));
        newOtherWorkout.forEach((item) => {
          promises.push(transaction.save(WorkoutSession, item));
        });

        await Promise.all(promises);
      });
    }

    if (destOrder < sourceOrder && sourceOrder - destOrder > 1) {
      const workouts = await this.workoutRepository.find({
        where: {
          date: moment(sourceDate, 'YYYY/MM/DD')['_d'],
          order: Between(destOrder, sourceOrder),
        },
        order: { order: 'ASC' },
      });
      const destWorkout = { ...workouts.pop(), order: destOrder };
      const newOtherWorkout = workouts.map((workout) => {
        ++workout.order;
        return workout;
      });

      await this.workoutRepository.manager.transaction(async (transaction) => {
        const promises = [];
        promises.push(transaction.save(WorkoutSession, destWorkout));
        newOtherWorkout.forEach((item) => {
          promises.push(transaction.save(WorkoutSession, item));
        });

        await Promise.all(promises);
      });
    }
  }

  /* external day Drag n Drop */
  async externalDayDnD(sourceOrder, sourceDate, destOrder, destDate) {
    const [sourceWorkouts, destWorkouts] = await Promise.all([
      this.workoutRepository.find({
        where: {
          date: moment(sourceDate, 'YYYY/MM/DD')['_d'],
        },
        order: { order: 'ASC' },
      }),
      this.workoutRepository.find({
        where: {
          date: moment(destDate, 'YYYY/MM/DD')['_d'],
        },
        order: { order: 'ASC' },
      }),
    ]);

    if (sourceWorkouts.length > 1) {
      const movedSourceWorkout = sourceWorkouts.slice(
        sourceOrder,
        sourceOrder + 1,
      );
      const newSourceWorkouts = sourceWorkouts
        .splice(sourceOrder + 1, sourceWorkouts.length)
        .map((workoutSession) => {
          --workoutSession.order;
          return workoutSession;
        });
      if (!destWorkouts.length) {
        const newDestWorkouts = [
          {
            ...movedSourceWorkout[0],
            date: moment(destDate, 'YYYY/MM/DD')['_d'],
            order: 0,
          },
        ];
        await this.workoutRepository.manager.transaction(
          async (transaction) => {
            const promises = [];
            promises.push(transaction.save(WorkoutSession, newDestWorkouts));
            promises.push(transaction.save(WorkoutSession, newSourceWorkouts));
            await Promise.all(promises);
          },
        );
      } else {
        const newDestWorkouts = destWorkouts.splice(
          destOrder,
          destWorkouts.length,
        );
        newDestWorkouts.forEach((workoutSession) => {
          ++workoutSession.order;
          return workoutSession;
        });
        const movedDestWorkout = {
          ...movedSourceWorkout[0],
          order: destOrder,
          date: moment(destDate, 'YYYY/MM/DD')['_d'],
        };

        await this.workoutRepository.manager.transaction(
          async (transaction) => {
            const promises = [];
            promises.push(transaction.save(WorkoutSession, newDestWorkouts));
            promises.push(transaction.save(WorkoutSession, newSourceWorkouts));
            promises.push(transaction.save(WorkoutSession, movedDestWorkout));
            await Promise.all(promises);
          },
        );
      }
    } else {
      if (!destWorkouts.length) {
        await this.workoutRepository.save({
          ...sourceWorkouts[0],
          order: 0,
          date: moment(destDate, 'YYYY/MM/DD')['_d'],
        });
      } else {
        const newDestWorkouts = destWorkouts.splice(
          destOrder,
          destWorkouts.length,
        );
        newDestWorkouts.forEach((workoutSession) => {
          ++workoutSession.order;
          return workoutSession;
        });

        const movedDestWorkout = {
          ...sourceWorkouts[0],
          order: destOrder,
          date: moment(destDate, 'YYYY/MM/DD')['_d'],
        };

        await this.workoutRepository.manager.transaction(
          async (transaction) => {
            const promises = [];
            promises.push(transaction.save(WorkoutSession, newDestWorkouts));
            promises.push(transaction.save(WorkoutSession, movedDestWorkout));
            await Promise.all(promises);
          },
        );
      }
    }
  }

  async createExercise(
    id: number,
    createExercise: CreateExerciseDTO,
  ): Promise<ResponseHandler> {
    try {
      const workout = await this.workoutRepository.findOne({ where: { id } });
      if (!workout)
        throw new ResponseHandler(false, ErrorException.WORKOUT_NOT_FOUND, 404);
      const newExercise = await this.exerciseRepository.save({
        name: createExercise.exerciseName,
        setNumber: createExercise.exerciseSetNumber,
        setInfo: createExercise.exerciseSetInfo,
        workoutSession: { id: workout.id },
      });
      return new ResponseHandler(true, newExercise, 200);
    } catch (error) {
      ErrorResponseHandler(error);
    }
  }
}
