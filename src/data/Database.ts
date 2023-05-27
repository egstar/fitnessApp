import { Pool } from "pg";
import * as conf from './config'

let dbName: string;
if(conf.ENV == "test"){
    dbName = conf.DB_TEST!
} else if(conf.ENV == "dev"){
    dbName= conf.DB_DEV!
} else{
    dbName = conf.DB_NAME!
}
const DbConn = new Pool({
    host: conf.DB_HOST,
    database: dbName,
    user: conf.DB_USER,
    password: conf.DB_PASS,
    port: Number(conf.DB_PORT),
})

export default DbConn;