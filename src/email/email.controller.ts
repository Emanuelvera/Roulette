import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { sendEmailDto } from './email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/send-email')
  async sendMail(@Body() body: sendEmailDto) {
    return await this.emailService.sendEmail(body);
  }

  @Get('/verify/:id')
  async verifyEmail(@Param('id') id: string) {
    try {
      await this.emailService.verifyEmail(Number(id));
      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new NotFoundException('Verification link is invalid or expired');
    }
  }
}
