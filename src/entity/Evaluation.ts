// src/entity/Evaluation.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Device } from './Device';
import { Media } from './Media';
import { Type } from './Type';

@Entity()
export class Evaluation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @Column()
  user: string;

  @Column('json')
  result: any;

  @Column('enum', { enum: Type })
  type: Type;

  @ManyToOne(() => Device, device => device.evaluations)
  @JoinColumn({ name: 'deviceId' })
  device: Device;

  @OneToOne(() => Media, media => media.evaluation, { nullable: true })
  image: Media;
}