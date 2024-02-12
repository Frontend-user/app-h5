import {ObjectId} from "mongodb";

export type UserEntityType = {
    _id: ObjectId
    login: string
    email: string
    createdAt: string
    password: string
}

export type UserCreateType = Omit<UserEntityType, '_id'>
export type UserHashType = Omit<UserEntityType, 'password' | '_id'> & {
    passwordSalt: string
    passwordHash: string
}
export type UserInputModelType = Omit<UserEntityType, '_id' | 'createdAt'>
export type UserViewType = Omit<UserEntityType, '_id' | 'password'> & {
    id: string
}

