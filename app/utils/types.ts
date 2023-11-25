export interface ICollection {
    id: string;
    name: string;
    collectionId: string;
    collectionName: string;
    created: Date;
    updated: Date;
    user: string;
}

export interface ITransaction {
    id: string;
    name: string;
    amount: number;
    isCredit: boolean;
    date: Date;
    collectionId: string;
    collectionName: string;
    created: Date;
    updated: Date;
    collection: string;
    user: string;
}
