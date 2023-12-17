// src/entity/Media.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
} from 'typeorm';
import { Evaluation } from './Evaluation';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('blob')
  data: Buffer;

  @OneToOne(() => Evaluation, evaluation => evaluation.image)
  evaluation: Evaluation;

  @Column({ default: 'image/jpeg' })
  mimeType: string;
}