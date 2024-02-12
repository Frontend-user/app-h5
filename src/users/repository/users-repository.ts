import {UserCreateType, UserHashType} from "../types/user-types";
import {usersCollection} from "../../db";
import {ObjectId} from "mongodb";

export const usersRepositories = {

    async createUser(user:UserHashType):Promise<false | ObjectId> {
        const response = await usersCollection.insertOne(user)
        return response ? response.insertedId : false
    },
    async deleteUser(id:ObjectId) {
        const response = await usersCollection.deleteOne({_id: id})
        return !!response.deletedCount
    }
}