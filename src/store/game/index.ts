import { create } from "zustand";

export const useGameStore = create<any>( (set, get) => ({
    userInvited: null,
    userInviting: null,

    setUsersToGame: ( payload: any ) => {
        set({ userInvited: payload?.userInvited });
        set({ userInviting: payload?.userInviting });
    },
}));