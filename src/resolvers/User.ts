import { Resolver, Mutation, ObjectType, Arg, Int, Query, InputType, Field } from 'type-graphql';
import db from '../database/sequelize/models/index';
import { Users } from '../entities/Users';
import { Hobbies } from '../entities/Hobbies';
import { Op } from 'sequelize';

@InputType()
class UserInsert {
    @Field()
    firstName!: string;

    @Field()
    lastName!: string;

    @Field(() => Int)
    age!: number;
}

@InputType()
class UserInsertWithHobby {
    @Field()
    firstName!: string;

    @Field()
    lastName!: string;

    @Field(() => Int)
    age!: number;

    // array of numbers
    @Field(() => [Int])
    hobbies!: [number];
}

@InputType()
class UserUpdate {
    @Field()
    firstName!: string;

    @Field()
    lastName!: string;

    @Field(() => Int)
    age!: number;
}

@InputType()
class UserUpdateWithHobby {
    @Field()
    firstName!: string;

    @Field()
    lastName!: string;

    @Field(() => Int)
    age!: number;

    // array of numbers
    @Field(() => [Int])
    hobbies!: [number];
}

// to fetch with hobbies
@ObjectType()
class withHobbies extends Users {
    @Field(() => [Hobbies])
    Hobbies!: Hobbies[];
}

@Resolver()
export class UserResolver {
    // select all
    @Query(() => [Users])
    async users() {
        const data = await db.User.findAll();
        return data;
    }

    // select one
    @Query(() => Users)
    async userOne(@Arg('id', () => Int) id: number) {
        const data = await db.User.findOne({ where: { id: id } });
        if (!data) throw new Error(`User doesn't exist. Please try again.`);
        return data;
    }

    // select with hobby
    @Query(() => [withHobbies!])
    async usersWithHobby() {
        const data = await db.User.findAll({
            include: [
                {
                    model: db.Hobby,
                    through: {
                        attributes: []
                    }
                }
            ]
        });
        return data;
    }

    // select one with hobby
    @Query(() => [withHobbies!])
    async userOneWithHobby(@Arg('id', () => Int) id: number) {
        const data = await db.User.findAll({
            where: { id: id },
            include: [
                {
                    model: db.Hobby,
                    through: {
                        attributes: []
                    }
                }
            ]
        });
        return data;
    }

    // insert user only
    @Mutation(() => Users)
    async createUser(@Arg('options', () => UserInsert) options: UserInsert) {
        const { firstName, lastName, age } = options;
        if (!firstName) throw new Error(`Please enter first name.`);
        if (!lastName) throw new Error(`Please enter last name.`);
        if (age <= 0) throw new Error(`Please enter a valid age.`);

        // select if user full name exist
        const check = await db.User.findAll({
            where: {
                where: db.sequelize.and(
                    db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('firstName')), db.sequelize.fn('lower', firstName)),
                    db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('lastName')), db.sequelize.fn('lower', lastName))
                )
            },
            attributes: [`id`]
        });
        if (check.length > 0) throw new Error(`User already exist. Please try again.`);

        const user = await db.User.create(options);
        return user.dataValues;
    }

    // insert with hobbies
    @Mutation(() => [withHobbies!])
    async createUserWIthHobby(@Arg('options', () => UserInsertWithHobby) options: UserInsertWithHobby) {
        const { firstName, lastName, age, hobbies } = options;
        if (!firstName) throw new Error(`Please enter first name.`);
        if (!lastName) throw new Error(`Please enter last name.`);
        if (age <= 0) throw new Error(`Please enter a valid age.`);
        if (hobbies.length <= 0) throw new Error(`Please select hobbies.`);

        // select if user full name exist
        const check = await db.User.findAll({
            where: {
                where: db.sequelize.and(
                    db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('firstName')), db.sequelize.fn('lower', firstName)),
                    db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('lastName')), db.sequelize.fn('lower', lastName))
                )
            },
            attributes: [`id`]
        });
        if (check.length > 0) throw new Error(`User already exist. Please try again.`);

        // use sequelize transaction for rollback.
        const result = await db.sequelize.transaction(async (t: any) => {
            try {
                const user = await db.User.create(options, { transaction: t });

                // UserId inserted
                const userId = user.dataValues.id;

                const hobbyArray = [];
                for (let i = 0; i < hobbies.length; i++) {
                    const e = hobbies[i]; // hobby id
                    hobbyArray.push({
                        UserId: userId,
                        HobbyId: e
                    });
                }
                const userHobby = await db.UserHobby.bulkCreate(hobbyArray, { transaction: t });
                return userId; // return user id
            } catch (e) {
                console.log(`Error: ${e}`);
                throw new Error(`Error on inserting, please try again.`);
            }
        });
        // If the execution reaches this line, the transaction has been committed successfully
        return this.userOneWithHobby(result);
    }

    // update user only
    @Mutation(() => Users)
    async updateUser(@Arg('options', () => UserUpdate) options: UserUpdate, @Arg('id', () => Int) id: number) {
        const { firstName, lastName, age } = options;
        if (!firstName) throw new Error(`Please enter first name.`);
        if (!lastName) throw new Error(`Please enter last name.`);
        if (age <= 0) throw new Error(`Please enter a valid age.`);

        // select if user full name exist
        const check = await db.User.findAll({
            where: {
                where: db.sequelize.and(
                    db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('firstName')), db.sequelize.fn('lower', firstName)),
                    db.sequelize.where(db.sequelize.col('id'), Op.ne, id),
                    db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('lastName')), db.sequelize.fn('lower', lastName)),
                    db.sequelize.where(db.sequelize.col('id'), Op.ne, id)
                )
            },
            attributes: [`id`]
        });

        //    db.sequelize.where(db.sequelize.col('id'), id)
        if (check.length > 0) throw new Error(`User already exist. Please try again.`);

        // use sequelize on update
        const user = await db.User.update(options, {
            where: {
                id
            }
        });
        // index 0 returns 1 if success else 0
        if (user[0] == 1) return this.userOne(id);
        else throw new Error(`Encountered some error during update. Please try again.`);
    }

    // update user with hobby
    @Mutation(() => [withHobbies!])
    async updateUserWIthHobby(@Arg('options', () => UserUpdateWithHobby) options: UserUpdateWithHobby, @Arg('id', () => Int) id: number) {
        const { firstName, lastName, age, hobbies } = options;
        if (!firstName) throw new Error(`Please enter first name.`);
        if (!lastName) throw new Error(`Please enter last name.`);
        if (age <= 0) throw new Error(`Please enter a valid age.`);
        if (hobbies.length <= 0) throw new Error(`Please select hobbies.`);

        // select if user full name exist
        const check = await db.User.findAll({
            where: {
                where: db.sequelize.and(
                    db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('firstName')), db.sequelize.fn('lower', firstName)),
                    db.sequelize.where(db.sequelize.col('id'), Op.ne, id),
                    db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('lastName')), db.sequelize.fn('lower', lastName)),
                    db.sequelize.where(db.sequelize.col('id'), Op.ne, id)
                )
            },
            attributes: [`id`]
        });

        if (check.length > 0) throw new Error(`User already exist. Please try again.`);

        // use sequelize transaction for rollback.
        await db.sequelize.transaction(async (t: any) => {
            try {
                await db.User.update(options, {
                    where: {
                        id
                    }
                });

                // bulk delete all users existing hobbies
                await db.UserHobby.destroy(
                    {
                        where: { UserId: id }
                    },
                    { transaction: t }
                );

                const hobbyArray = [];
                for (let i = 0; i < hobbies.length; i++) {
                    const e = hobbies[i]; // hobby id
                    hobbyArray.push({
                        UserId: id,
                        HobbyId: e
                    });
                }

                // bulk insert
                await db.UserHobby.bulkCreate(hobbyArray, { transaction: t });
                return true;
            } catch (e) {
                console.log(`Error: ${e}`);
                throw new Error(`Error on updating, please try again.`);
            }
        });
        // If the execution reaches this line, the transaction has been committed successfully
        return this.userOneWithHobby(id);
    }

    // delete user also his/her hobbies
    @Mutation(() => String)
    async deleteUserAndHobbies(@Arg('id', () => Int) id: number) {
        // use sequelize transaction for rollback.
        const result = await db.sequelize.transaction(async (t: any) => {
            try {
                await this.userOne(id); // will throw an error of user doesn't exist just see console

                // bulk delete all users existing hobbies
                await db.UserHobby.destroy(
                    {
                        where: { UserId: id }
                    },
                    { transaction: t }
                );

                // delete  user
                await db.User.destroy(
                    {
                        where: { id }
                    },
                    { transaction: t }
                );

                return true;
            } catch (e) {
                console.log(`Error: ${e}`);
                throw new Error(`Error on deleting, please try again.`);
            }
        });
        // index 0 returns 1 if success else 0
        if (result) return `User and corresponding hobbies has been deleted successfully.`;
        else throw new Error(`Encountered some error during delete. Please try again.`);
    }
}
