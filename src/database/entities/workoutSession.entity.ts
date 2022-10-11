import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { CustomBaseEntity } from './customBaseEntity.entity';
import { Exercise } from './exercises.entity';

@Entity()
export class WorkoutSession extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int', unsigned: true })
  @Index('order')
  order: number;

  @Column({ nullable: false })
  @Index('date')
  date: Date;

  @OneToMany(() => Exercise, (exercise) => exercise.workoutSession)
  exercises: Exercise[];
}
