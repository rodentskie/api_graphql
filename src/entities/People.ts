import { Field, Int, ObjectType } from 'type-graphql';
import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@ObjectType()
@Entity()
export class People {
    @ObjectIdColumn()
    id!: ObjectID;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Field(() => Int)
    @Column('int')
    age!: number;
}
