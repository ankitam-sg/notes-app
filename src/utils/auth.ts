type User = {
    name: string,
    email: string,
    password: string
}

export const auth = {
    // Check if user is logged in
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem("authToken");
    },

    // LOGIN User
    login: (user: User): void => {
        localStorage.setItem("authToken", "fake-token");
        localStorage.setItem("currentUser", JSON.stringify(user));
    },

    // LOGOUT User
    logout: (): void => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
    },

    // Get current logged-in user
    getCurrentUser: (): User | null => {
        const user = localStorage.getItem("currentUser");
        return user ? JSON.parse(user) : null;
    }
};