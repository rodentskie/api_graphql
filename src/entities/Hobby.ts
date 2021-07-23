import { Column, Entity, ObjectID, ObjectIdColumn, BaseEntity } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Hobby extends BaseEntity {
    @ObjectIdColumn()
    id!: ObjectID;

    @Field()
    @Column()
    name!: string;

    @Field()
    @Column()
    createdAt!: Date;

    @Field()
    @Column()
    updatedAt!: Date;
}
