export function decreaseTime(value, time){
    value = value - time < 1 ? 1 : value;
    return value;
}