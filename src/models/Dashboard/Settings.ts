import DbConn from "@/data/Database";
import { MenuItem } from "@/data/types";

export const getMenu = async(usrLvl: number): Promise<MenuItem[]> => {
    try {
        const conn = await DbConn.connect();
        const sQuery: string = `SELECT * FROM menu WHERE level<=$1 ORDER BY id`;
        const result = await conn.query(sQuery, [usrLvl])
        conn.release();

        return result.rows
    } catch(e) {
        throw new Error(`Access denied! ${e}`);
    }
}




