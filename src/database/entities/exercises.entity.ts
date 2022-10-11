import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './customBaseEntity.entity';
import { WorkoutSession } from './workoutSession.entity';

@Entity()
export class Exercise extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorkoutSession, (workoutSession) => workoutSession.exercises)
  workoutSession: WorkoutSession;

  @Column()
  name: string;

  @Column({ type: 'int' })
  setNumber: number;

  @Column()
  setInfo: string;
}
