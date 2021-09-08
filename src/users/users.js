class ManageUsers {
    constructor() {
       this.users = [];
    }

    addUser = ({id, firstName, lastName, room}) => {
        const user = {id, firstName, lastName, room}
        const existingUserName = this.users.find(user => user.firstName.trim().toLowerCase() === firstName.trim().toLowerCase());
        if (existingUserName) return { error: "Username has already been taken" };
        
        const existingUserIdIndex = this.users.findIndex(user => user.id === id);
        if (existingUserIdIndex !== -1) {
           return this.users.splice(existingUserIdIndex, 1, user);
        }

        if (!firstName || !room) return { error: "Username and room are required" };
        
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
