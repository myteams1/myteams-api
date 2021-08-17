export class MyTeamsError extends TypeError {
    constructor(message) {
        super();
        this.name = 'MyTeams Error'
        this.message = message;
    }
}