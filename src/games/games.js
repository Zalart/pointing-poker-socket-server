class ManageGames {
  constructor() {
    this.games = {};
  }

  newGame = (gameId) => {
    const game = {
      users: [],
      cards: [],
      issues: [],
      gameSettings: {
        isPlayer: true,
        changingCard: false,
        autoEntrance: true,
        changingDecision: false,
        isTimer: false,
        scoreType: "story points",
        scoreTypeShort: "SP",
        minutes: "",
        seconds: "",
      },
      roundsData: [],
      chatMessages: [],
    };
    this.games[gameId] = game;
  };

  addUser = (gameId, userToAdd) => {
    const existingUserName = this.games[gameId].users.find((user) => {
      return (
        user.firstName.trim().toLowerCase() ===
        userToAdd.firstName.trim().toLowerCase()
      );
    });

    if (existingUserName) return { error: "Username has already been taken" };

    const existingUserIdIndex = this.games[gameId].users.findIndex(
      (user) => user.userId === userToAdd.userId
    );

    if (existingUserIdIndex !== -1) {
      return this.games[gameId].users.splice(existingUserIdIndex, 1, userToAdd);
    }
    // Add new user if no userData found in users array
    this.games[gameId].users.push(userToAdd);
  };

  getUsers = gameId => {
    if (this.games[gameId]) {return this.games[gameId].users}
    else {return []}
  }

  getGameData = gameId => {
    if (this.games[gameId]) {return this.games[gameId]}
    else {return {users: [], cards: [], issues: [], gameSettings: {}}}
  }

  setGameData = ({ gameId, data }) => {
    const { cards, issues, gameSettings } = data;
    this.games[gameId].issues = issues;
    this.games[gameId].cards = cards;
    this.games[gameId].gameSettings = gameSettings;
  };

  getGames = () => Object.keys(this.games);

  removeUser = (gameId, id) => {
    const index = this.games[gameId].users.findIndex(
      (user) => user.userId === id
    );
    if (index !== -1) {
      return this.games[gameId].users.splice(index, 1)[0];
    } else {
      return "user not found";
    }
  };

  checkRoom(room) {
    if (!this.games[room].users.length) {
      delete this.games[room];
      return true;
    } else {
      return false;
    }
  }

  addChatMessage = ({ room, userId, message }) => {
    this.games[room].chatMessages.unshift({ userId, message });
  };

  getChatMessages = (room) => {
    return this.games[room].chatMessages;
  };
}

export default new ManageGames();
