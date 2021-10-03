

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
        votes: new Set(),
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

  cardClick({room, id, cardId}) { 
    if (!playGames.has(room)) { return }
    const {issues, votes} = playGames.get(room).users.find(user => user.userId === id);
    const issueIndex = issues.findIndex(issue => issue.selected === true);
    if (issueIndex < issues.length - 1) {
      issues.forEach((issue, index) => {
        if (index === issueIndex + 1) { issue.selected = true } 
        else { issue.selected = false }
      })
    }
    const vote = (`00${issueIndex}`).slice(-3) + (`00${cardId}`).slice(-3);
    votes.add(vote);
    if (votes.size !== issues.length) { return false } 
    playGames.get(room).voted -= 1;
    return true;
  }

  checkGame(room) {
    if (!playGames.has(room)) { return }
    return playGames.get(room).voted ?  false : true;
  }
  
  getResults(room) {
    if (!playGames.has(room)) { return }
    const results = {};
    const { users } = playGames.get(room);
    users.forEach(user => {
      const {votes} = user;
      votes.forEach(vote => {
        const issue = Number(vote.slice(0, 3));
        const card = Number(vote.slice(3));
        if (!results[issue]) { results[issue] = {} }
        if (!results[issue][card]) { results[issue][card] = 1 }
        else { results[issue][card] += 1 }
      })     
    })
    const issuesList = Object.keys(results);
    const newIssuesList = [];
    issuesList.forEach(el => newIssuesList.push(+el));
    newIssuesList.sort((a, b) => a - b);
    const returnResult = [];
    newIssuesList.forEach(el => {
      const issueResult = results[el];
      const cardsNum = Object.values(issueResult).reduce((acc, el) => acc += el, 0);
      const obj = {};
      Object.keys(issueResult).forEach(key => {
        obj[key] = `${Math.trunc((issueResult[key] / cardsNum) * 100)} %`;
      })
      returnResult.push(obj);
    }) 
    playGames.delete(room);
    return returnResult;
  }

}

export const PlayGame = new Game();
export const endPlayMessage = `<h1 class='block__title'>Please wait</h1><h2 class='block__question'>the results of game.</h2>`;
