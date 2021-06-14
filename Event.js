class Event {
    constructor(title, user, time, location) {
        this.title = title;
        this.user = user;
        this.time = time;
        this.location = location;
    }
}
const D = new Date();
const summit = new Event("summit1", "person", D, "house");

console.log(summit.title);
console.log(summit.time);
console.log(summit.location);