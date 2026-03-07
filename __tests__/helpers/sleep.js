// A simple helper function to pause execution for a specified amount of time.
export default function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
