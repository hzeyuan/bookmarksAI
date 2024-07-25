import type { PlasmoCSConfig } from "plasmo";
import { relayMessage } from "@plasmohq/messaging"
export const config: PlasmoCSConfig = {
    matches: ["http://localhost:1947/*"],
}


relayMessage({
    name: "bookmarks"
})

relayMessage({
    name: 'is_installed'
})