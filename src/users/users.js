class ManageUsers {
    constructor() {
       this.users = [];
    }

    addUser = ({id, firstName, lastName, room}) => {
        const existingUser = this.users.find(user => user.firstName.trim().toLowerCase() === firstName.trim().toLowerCase());

        if (existingUser) return { error: "Username has already been taken" };
        if (!firstName || !lastName || !room) return { error: "Username and room are required" };
        const user = {id, firstName, lastName, room}
        this.users.push(user);
        return { user }
    }

    removeUser = (id) => {
        const index = this.users.findIndex((user) => user.id === id);
        if (index !== -1) 
        {
            return this.users.splice(index, 1)[0];
        } else {
            return 'user not found';
        }

    }

    getUsers = (room) => this.users.filter(user => user.room === room)
}

export default new ManageUsers();
