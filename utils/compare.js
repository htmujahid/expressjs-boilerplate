import bcrypt from "bcryptjs";
export async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}
