import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateRecordDto {
  @IsNotEmpty()
  @IsDateString()
  date: string; // Дата в формате ISO (например, '2025-01-26T12:00:00Z')

  @IsNotEmpty()
  @IsNumber()
  doctorId: number; // ID врача
}
