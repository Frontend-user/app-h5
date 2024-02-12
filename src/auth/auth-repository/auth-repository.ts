import {usersCollection} from "../../db";
import {AuthType} from "../auth-types/auth-types";

export const authRepositories = {

    async authUser(auth:AuthType):Promise<boolean> {
        const response = await usersCollection.findOne({ $or: [{login:auth.loginOrEmail}, {email: auth.loginOrEmail}]})
        return !!response
    },
    async getUserHash(auth:AuthType){
         const response = await usersCollection.findOne({ $or: [{login:auth.loginOrEmail}, {email: auth.loginOrEmail}]})
        return response ? response: false
    }

}