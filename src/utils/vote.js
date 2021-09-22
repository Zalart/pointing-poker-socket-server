export const votes = new Map();

export class Vote {
  constructor({ userName, usersNum }) {
    this.userName = userName;
    this.half = usersNum / 2;
  }

  sendMessage() {
    return `<div class='block__message'>
      <h1 class='block__title'>User ${this.userName} was offered to kick!</h1>
      <h2 class='block__question'>Are you agree with it?</h2>
      <input id='input-yes' class='block__input' type='button' value='YES' />
      <input id='input-no' class='block__input' type='button' value='NO' />
    </div>`
  }
}