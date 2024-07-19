import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { sendEmailDto } from './email.dto';
import Mail from 'nodemailer/lib/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/user.entity';

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  private template(html: string, replacements: Record<string, string>) {
    return html.replace(/%(\w*)%/g, (m, key) =>
      replacements.hasOwnProperty(key) ? replacements[key] : '',
    );
  }

  async sendEmail(dto: sendEmailDto) {
    const html = dto.placeholderReplacements
      ? this.template(dto.html, dto.placeholderReplacements)
      : dto.html;

    const options: Mail.Options = {
      from: dto.from ?? {
        name: this.configService.get<string>('APP_NAME'),
        address: this.configService.get<string>('DEFAULT_MAIL_FROM'),
      },
      to: dto.recipients,
      subject: dto.subject,
      html,
    };

    try {
      return await this.transporter.sendMail(options);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendVerificationEmail(user: User) {
    const dto: sendEmailDto = {
      recipients: [{ name: user.username, address: user.email }],
      subject: 'Verification mail',
      html: `<p>Hi ${user.username} <hr> Please click <a href="http://localhost:3000/email/verify/${user.id}">here</a> to verify your account</p>`,
    };

    await this.sendEmail(dto);
  }

  async verifyEmail(userId: number): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Invalid user ID');
    }

    user.account_activated = true;
    await this.usersRepository.save(user);
    return 'Validation ok';
  }
}
