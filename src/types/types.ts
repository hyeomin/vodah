export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
};

export type Class = {
    id: string;
    name: string;
    description: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
};
