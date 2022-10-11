// import { IsOptional, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DragAndDropWorkoutDTO {
  //   @IsOptional()
  //   @IsString()
  @ApiProperty({
    example: {
      order: 0,
      date: '2022/10/14',
    },
  })
  source: { order: number; date: string };

  @ApiProperty({
    example: {
      order: 0,
      date: '2022/10/16',
    },
  })
  destination: { order: number; date: string };
}
