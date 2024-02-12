import {UserCreateType, UserHashType} from "../types/user-types";
import {usersCollection} from "../../repositories/db";
import {ObjectId} from "mongodb";

export const usersRepositories = {

    async createUser(user:UserHashType):Promise<false | ObjectId> {
        const response = await usersCollection.insertOne(user)
        return response ? response.insertedId : false
    },
    async deleteUser(id:ObjectId) {
        const users = await  usersCollection.find({}).toArray()
        console.log(users,'users')
        console.log(users.length,'users')
        const response = await usersCollection.deleteOne({_id: id})
        const usersAfterDelete = await  usersCollection.find({}).toArray()
        const usersToDelete = await  usersCollection.findOne({_id: id})
        console.log(usersAfterDelete,'usersAfterDelete')
        console.log(usersAfterDelete.length,'usersAfterDelete')
        console.log(usersToDelete,'usersToDelete')
        return !!response.deletedCount
    }
}