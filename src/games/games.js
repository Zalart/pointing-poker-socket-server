class ManageGames {
    constructor() {
        this.games = {
            //gameId: {users, cards, issues, settings, roundsData}
        };
/*         //example structure:

        this.users = [];
        this.cards = [];
        this.issues = [{
            title,
            link,
            priority
        }];
        this.gameSettings = {
            isMasterPlays,
            //isTimer, //не уверен, что нужно дополнительное свойство isTimer
            roundTimer,
            scoreTypeShort,
            scoreTypeFull,
            cardsNumber,
            coverStyle
        }; */
    }

    newGame = (gameId) => {
        const game = {
            users: [],
            cards: [],
            issues: [],
            gameSettings: {},
            roundsData: []
        }
        this.games[gameId] = game;
    }

    addUser = (gameId, userToAdd) => {

        const existingUserName = this.games[gameId].users.find(user => {
            return user.firstName.trim().toLowerCase() === userToAdd.firstName.trim().toLowerCase()
         })

        if (existingUserName) return { error: "Username has already been taken" };
        
        const existingUserIdIndex = this.games[gameId].users.findIndex(user => user.userId === userToAdd.userId);

        if (existingUserIdIndex !== -1) {
            
           return this.games[gameId].users.splice(existingUserIdIndex, 1, userToAdd);
        }
        // Add new user if no userData found in users array
        this.games[gameId].users.push(userToAdd);

    }

    getUsers = gameId => this.games[gameId].users;

    getGameData = gameId => this.games[gameId];

    getGames = () => Object.keys(this.games);

    removeUser = (id) => {
        const index = this.users.findIndex((user) => user.id === id);
        if (index !== -1) 
        {
            return this.users.splice(index, 1)[0];
        } else {
            return 'user not found';
        }

    }

    
}

export default new ManageGames();
