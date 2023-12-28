import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Evaluation } from './Evaluation';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('longblob')
  data: Buffer;

  @OneToOne(() => Evaluation, evaluation => evaluation.media)
  @JoinColumn({ name: 'evaluationId' })
  evaluation: Evaluation;

  @Column({ default: 'image/jpeg' })
  mimeType: string;
}