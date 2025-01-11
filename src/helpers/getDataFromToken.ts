import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getDataFromToken = async (req: Request) => {
    try {
        const jwtSecret = process.env.JWT_SECRET || "123qwsaqw2frWE";
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value || '';
        const decodedToken: any = jwt.verify(token, jwtSecret);
        return decodedToken.id || decodedToken._id;
    } catch (error) {
        console.log("Token error:", error);
        return null;
    }
}; 