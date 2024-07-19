export interface IUser {
    user: {
        name: string;
        email: string;
        avatar: string;
        _id: string;
        online: boolean;
    },
    token: string;
}
