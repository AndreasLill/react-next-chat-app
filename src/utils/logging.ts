export function PusherLogger(message: string) {
    if (message.toLowerCase().includes('state changed')) {
        console.log(message)
    }
}
