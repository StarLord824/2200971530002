export default function shortCodeGenerator() {
    //generate random string of length 6
    const randomString = Math.random().toString(36).substring(2, 7);
    // const randomNumber = Math.floor(Math.random() * 100000);
    // return randomNumber.toString();
    return randomString;
}