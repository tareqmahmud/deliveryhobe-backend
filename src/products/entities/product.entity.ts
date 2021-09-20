import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  sale_price: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ default: true })
  in_stock: boolean;

  @Column({ default: false })
  is_taxable: boolean;

  @Column()
  shipping_class: string; // TODO: Make it enum

  @Column({ nullable: true })
  unit: string;

  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  width: number;

  @Column()
  image: string; //  TODO: Connect it with media

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
