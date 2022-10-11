// import { IsOptional, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseDTO {
  //   @IsOptional()
  //   @IsString()
  @ApiProperty({
    example: 'Bench Press Medium Grip',
  })
  exerciseName: string;

  @ApiProperty({
    example: 3,
  })
  exerciseSetNumber: number;

  @ApiProperty({
    example: '50 lb x 9, 60 lb x 7, 70 lb x 5',
  })
  exerciseSetInfo: string;
}
