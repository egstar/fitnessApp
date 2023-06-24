export type MenuItem = {
    id: number,
    opt: string,
    url: string,
    logo: string,
    sub?: string[],
    level: number,
}

export type PgInfo = {
    id: number,
    page: string,
    tree: string,
    isActive?: number,
    sub: boolean,
    subParent?: number
}

export type User = {
    id?: number,
    uname?: string,
    img?: string,
    fname?: string,
    lname?: string,
    email?: string,
    passwd?: string,
    regdate?: Date,
    lid?: number,
    sid?: string,
    sissue?: Date,
    sexpiry?: Date,
    level?: string
}

export type uSession = {
    uid: number,
    sid: string,
    lid: number,
    sissue: Date,
    sexpiry: Date
}

export type uCookie = {
    token: string,
    cid: string,
    expAt: Date
}

export type Task = {
    uid?: number,
    tid?: number,
    pid?: number,
    tdate?: Date,
    tstatus?: number
}