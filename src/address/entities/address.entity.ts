import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  street: string;

  @Column({ length: 50 })
  appartmentNumber: string;

  @Column({ length: 50 })
  floor: string;

  @Column({ length: 50 })
  buildingNumber: string;

  @Column({ length: 50 })
  locationType: string;

  @Column({ length: 255, nullable: true })
  label: string;

  @Column({ length: 100 })
  district: string;

  @ManyToOne(() => User, user => user.addresses)
  User: User;
}
