import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/create-authentication.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
  }
  @Post('deliveryLogin')
  deliveryLogin(@Body() loginDto: LoginDto) {
    return this.authenticationService.deliveryLogin(loginDto);
  }
}
