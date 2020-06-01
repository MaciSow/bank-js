import { slideReset } from "./utilities.js";

export class Contest {
    contestContainer = document.querySelector('#contestContainer');

    accounts = [];

    show(accounts) {
        slideReset(this.contestContainer);
        this.accounts = accounts;
    }
}