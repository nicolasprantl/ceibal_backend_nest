import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany, CreateDateColumn,
} from 'typeorm';
import { Evaluation } from './Evaluation';
import { Category } from './Category';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column('enum', { enum: Category })
  category: Category;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  tender: string;

  @OneToMany(() => Evaluation, evaluation => evaluation.device)
  evaluations: Evaluation[];
}