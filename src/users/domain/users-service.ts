import {ObjectId} from "mongodb";
import {usersRepositories} from "../repository/users-repository";
import {UserCreateType, UserHashType, UserViewType} from "../types/user-types";
import {usersQueryRepository} from "../query-repository/users-query-repository";

const bcrypt = require('bcrypt');


export const usersService = {
    async createUser(user: UserCreateType): Promise<ObjectId | false> {
        const passwordSalt =  await bcrypt.genSalt(10)
        const passwordHash = await this.__generateHash(user.password, passwordSalt)

        let changeUserData: any = {...user}
        delete changeUserData.password
        const userHashData: UserHashType = {
            ...changeUserData,
            'passwordSalt': passwordSalt,
            'passwordHash': passwordHash
        }
        console.log(userHashData, 'userHashData,')
        const userId = await usersRepositories.createUser(userHashData)
        if (!userId) {
            return false
        }
        return userId


    },
    async deleteUser(id: ObjectId): Promise<boolean> {
        return await usersRepositories.deleteUser(id)

    },

    async __generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        if (hash) {
            return hash
        }
        return false
    },

    async __generateSalt() {
    },
}