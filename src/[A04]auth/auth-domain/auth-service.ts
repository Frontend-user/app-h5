import {AuthType} from "../auth-types/auth-types";
import {authRepositories} from "../auth-repository/auth-repository";

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
export const authService = {
    async authUser(authData: AuthType): Promise<boolean> {
        const isExistLogin = await authRepositories.authUser(authData)
        const res = await authRepositories.getUserHash(authData)
        // console.log(res,'res')
        if (res && isExistLogin) {
            const passwordSalt = res.passwordSalt
            const passwordHash = res.passwordHash
            const newPasswordHash = await bcrypt.hash(authData.password, passwordSalt)
            // console.log(')newPasswordHash',newPasswordHash)
            if (newPasswordHash === passwordHash) {
                return true
            } else return false
        }
        return false
    }
}