import Model from "./Model";
import RsvpGuest from "./RsvpGuest";

export default class Rsvp extends Model {
    resource() {
        return "rsvp";
    }

    guests() {
        return this.hasMany(RsvpGuest);
    }
}
