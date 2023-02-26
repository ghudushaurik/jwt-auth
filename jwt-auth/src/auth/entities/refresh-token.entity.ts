import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { sign } from 'jsonwebtoken';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @Column({
    nullable: false,
  })
  userId: number;

  @Column({
    nullable: false,
  })
  userAgent: string;

  @Column({
    nullable: false,
  })
  ipAddress: string;

  sign(): string {
    return sign({ ...this }, process.env.REFRESH_SECRET);
  }
}
