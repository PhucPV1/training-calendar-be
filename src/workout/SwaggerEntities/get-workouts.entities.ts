import { ApiProperty } from '@nestjs/swagger';

export class GetWorkoutsEntity {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    example: [
      { dayOfTheWeek: 'Mon', dayOfTheMonth: '2022/10/10', workoutSessions: [] },
      { dayOfTheWeek: 'Tue', dayOfTheMonth: '2022/10/11', workoutSessions: [] },
      {
        dayOfTheWeek: 'Wed',
        dayOfTheMonth: '2022/10/12',
        workoutSessions: [
          {
            id: 2,
            name: 'LEG DAY',
            order: 0,
            exercises: [
              {
                id: 3,
                name: 'Exercise C',
                setNumber: 1,
                setInfo: '30 lbs x 6',
              },
              {
                id: 4,
                name: 'Exercise D',
                setNumber: 1,
                setInfo: '40 lbs x 5',
              },
              {
                id: 5,
                name: 'Exercise E',
                setNumber: 1,
                setInfo: '50 lbs x 5',
              },
            ],
          },
        ],
      },
      {
        dayOfTheWeek: 'Thu',
        dayOfTheMonth: '2022/10/13',
        workoutSessions: [
          {
            id: 1,
            name: 'FULL CHEST & TRICEPS WORKOUT FOR A BIGGER CHEST & BIGGER ARMS',
            order: 0,
            exercises: [
              {
                id: 1,
                name: 'Bench Press Medicine Ball Power Throw',
                setNumber: 3,
                setInfo: '50 lbs x 5, 60 lbs x 5, 70 lbs x 2',
              },
              {
                id: 2,
                name: 'Exercise B',
                setNumber: 1,
                setInfo: '40 lbs x 10',
              },
            ],
          },
          {
            id: 3,
            name: 'ARM DAY',
            order: 1,
            exercises: [
              {
                id: 6,
                name: 'Exercise F',
                setNumber: 1,
                setInfo: '60 lbs x 6',
              },
            ],
          },
        ],
      },
      {
        dayOfTheWeek: 'Fri',
        dayOfTheMonth: '2022/10/14',
        workoutSessions: [
          {
            id: 4,
            name: 'WORKOUT 1',
            order: 0,
            exercises: [{ id: 7, name: 'test', setNumber: 3, setInfo: 'ok' }],
          },
        ],
      },
      {
        dayOfTheWeek: 'Sat',
        dayOfTheMonth: '2022/10/15',
        workoutSessions: [
          { id: 6, name: 'WORKOUT 3', order: 0, exercises: [] },
          { id: 5, name: 'WORKOUT 2', order: 1, exercises: [] },
        ],
      },
      { dayOfTheWeek: 'Sun', dayOfTheMonth: '2022/10/16', workoutSessions: [] },
    ],
  })
  data: string;

  @ApiProperty({ example: 200 })
  statusCode: number;
}
