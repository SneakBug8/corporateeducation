interface ICRUDEntity {
    id: undefined | number;

    GetById(id: number): ICRUDEntity

    Insert(step: ICRUDEntity): void

    Update(step: ICRUDEntity): void

    Delete(id: number): void

    GetMany(query: any): Promise<ICRUDEntity[]>

    Count(): Promise<number>
}

export function staticImplements<T>() {
    return <U extends T>(constructor: U) => {constructor};
}