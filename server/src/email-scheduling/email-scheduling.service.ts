import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { EmailService } from '../email/email.service';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class EmailSchedulingService {
  constructor(
    @Inject(forwardRef(() => EmailService))
    private emailService: EmailService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  scheduleEmail(email: string) {
    const date = new Date();
    const job = new CronJob(CronExpression.EVERY_5_SECONDS, async () => {
      await this.emailService.sendMail({
        to: email,
        subject: 'test subject',
        text: 'text for email',
      });
    });

    this.schedulerRegistry.addCronJob(`${Date.now()}-${'123'}`, job);
    job.start();
  }
}
