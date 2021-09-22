export const votes = new Map();
const closeBttn = '<input id="input-close" class="block__input" type="button" value="OK"/>';
export const messToKick = `<h1 class='block__title'>You were kicked.</h1>${closeBttn}`;
export const firstMessToKick = `<h1 class='block__title'>Voting has started to kick you.</h1>`;
export const draw = `<h1 class='block__title'>Draw.</h1><h2 class='block__question'>Try vote again.</h2>${closeBttn}`
export const drawToKick = `<h1 class='block__title'>You were not kicked.</h1>${closeBttn}`
export class Vote {
  constructor({ userName, usersNum, userToKickId }) {
    this.userName = userName;
    this.half = (usersNum - 1) / 2;
    this.voted = new Set();
    this.voteYes = 0;
    this.voteNo = 0;
    this.userToKickId = userToKickId;
    this.voteNum = usersNum - 1;
  }

  sendMessage() {
    return `<div class='block__message'>
      <h1 class='block__title'>User ${this.userName} was offered to kick!</h1>
      <h2 class='block__question'>Are you agree with it?</h2>
      <input id='input-yes' class='block__input' type='button' value='YES' />
      <input id='input-no' class='block__input' type='button' value='NO' />
    </div>`
  }

  addVote({ vote, id }) {
    if (this.voted.has(id)) {return undefined}
    this.voted.add(id);
    vote ? this.voteYes += 1 : this.voteNo += 1;
    if (this.voteNo > this.half) { return {kick: false, message: `<h1 class='block__title'>User ${this.userName} was not kicked.</h1>${closeBttn}`} }
    if (this.voteYes > this.half) {return {kick: true, message: `<h1 class='block__title'>User ${this.userName} was kicked.</h1>${closeBttn}`}}
    if ((this.voteYes === this.half || this.voteNo === this.half) && this.voted.size === this.voteNum) { return { kick: false, message: draw } } 
    return {kick: 'undefined' ,message: `<h1 class='block__title'>Please wait ending of the vote.</h1>${closeBttn}`};
    
  }
}