

export const playGames = new Map();
import store from '../games/games';

class Game {
  
  createNewGame(room) {
    const {users, cards, issues, gameSettings} = store.getGameData(room);
    const gameUsers = users.map(user => {
      const newIssues = issues.map(issue => { return {...issue} });
      if (newIssues.length) { newIssues[0].selected = true }; 
      const newCards = cards.map(card => { return {...card} });
      return {
        userId:user.userId, 
        issues: [...newIssues],
        cards: newCards,
      }
    });
    const voted = gameUsers.length;
    playGames.set(room, {users: gameUsers, gameSettings, voted}); 
  }

  deletePlayer({room, id}) {
    if (!playGames.has(room)) { return }
    const { gameSettings, users } = playGames.get(room);
    let { voted } = playGames.get(room);
    const delUserInd = users.findIndex(user => user.userId === id);
    console.log
    users.splice(delUserInd, 1);
    voted -= 1;
    playGames.set({ users, gameSettings, voted });
  }

  getUserData({room, id}) {
    if (!playGames.has(room)) { return }
    const {issues, cards} = playGames.get(room).users.find(user => user.userId === id);
    return { issues, cards }
  }
}

export const PlayGame = new Game();