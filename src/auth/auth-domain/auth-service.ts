import {AuthType} from "../auth-types/auth-types";
import {authRepositories} from "../auth-repository/auth-repository";

const bcrypt = require('bcrypt');
export const authService = {
    async authUser(authData: AuthType): Promise<boolean> {
        const isExistLogin = await authRepositories.authUser(authData)
        const res = await authRepositories.getUserHash(authData)
        if (res && isExistLogin) {
            const passwordSalt = res.passwordSalt
            const passwordHash = res.passwordHash
            const newPasswordHash = await bcrypt.hash(authData.password, passwordSalt)
            return newPasswordHash === passwordHash;
        } else {
            return false
        }
    }
}