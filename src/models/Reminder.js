import Model from "./Model";
import RsvpGuest from "./RsvpGuest";

export default class Reminder extends Model {
    resource() {
        return "reminder";
    }
}
