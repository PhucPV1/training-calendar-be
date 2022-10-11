export interface IExampleData {
  workoutSessions: {
    name: string;
    order: number;
    date: string | Date;
    id: number;
  }[];
  exercises: {
    name: string;
    setNumber: number;
    id: number;
    setInfo: string;
    workoutSession?: any;
  }[];
}
