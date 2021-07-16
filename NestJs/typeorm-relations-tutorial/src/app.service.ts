import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactInfo } from './contact-info.entity';
import { Employee } from './employee.entity';
import { Meeting } from './meeting.entity';
import { Task } from './task.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    @InjectRepository(Meeting) private meetingRepo: Repository<Meeting>,
    @InjectRepository(ContactInfo) private contactRepo: Repository<ContactInfo>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
  ) {}
  async seed() {
    const ceo = this.employeeRepo.create({ name: 'Mr.CEO' });
    await this.employeeRepo.save(ceo);
    const ceoContactInfo = this.contactRepo.create({
      email: 'email@email.com',
      employee: ceo,
    });
    await this.contactRepo.save(ceoContactInfo);

    const manager = this.employeeRepo.create({
      name: 'Kartik',
      manager: ceo,
    });
    const task1 = this.taskRepo.create({ name: 'Hire people' });
    await this.taskRepo.save(task1);
    const task2 = this.taskRepo.create({ name: 'Hire people' });
    await this.taskRepo.save(task2);
    manager.tasks = [task1, task2];
    const meeting1 = this.meetingRepo.create({ zoomUrl: 'meeting.com' });
    meeting1.attendees = [ceo];
    await this.meetingRepo.save(meeting1);
    manager.meetings = [meeting1];
    await this.employeeRepo.save(manager);
  }

  getEmployeeId(id: number) {
    return this.employeeRepo.findOne(id, {
      relations: [
        'manager',
        'directReports',
        'tasks',
        'contactInfo',
        'meetings',
      ],
    });
  }
  deleteEmployee(id: number) {
    return this.employeeRepo.delete(id);
  }
}
