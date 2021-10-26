import { IsEmail, IsOptional, IsString } from 'class-validator'
export class CreateUserDto {
  @IsString()
  firstName: string

  @IsOptional()
  @IsString()
  lastName: string

  @IsEmail()
  email: string

  @IsString()
  password: string
}
