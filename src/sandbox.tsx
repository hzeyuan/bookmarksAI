import { relayMessage } from "@plasmohq/messaging"

relayMessage(
    {
        name: "bookmarks"
    },
    async (req) => {
        console.log("some message was relayed:", req)
        return {
            message: "Hello from sandbox"
        }
    }
)