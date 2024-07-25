import type { PlasmoCSConfig } from "plasmo";
import { relayMessage, sendToBackground } from "@plasmohq/messaging"
export const config: PlasmoCSConfig = {
    matches: ["http://localhost:1947/*", "https://bookmarks-ai.vercel.app/*"],
}


relayMessage({
    name: "bookmarks"
})

relayMessage({
    name: 'is_installed'
})







const port = chrome.runtime.connect({ name: "bookmarkAIConnection" });

// 监听来自网页的消息
window.addEventListener("message", async (event) => {
    if (event.source !== window) return;
    if (event.data.type === "CHECK_BOOKMARK_AI_EXTENSION") {

        window.postMessage({
            name: "is_installed",
            body: {
                type: "BOOKMARK_AI_EXTENSION",
                isInstalled: true
            }
        }, "*");
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.name === "installationCheck") {
        // 向网页发送消息
        window.postMessage({
            type: "BOOKMARK_AI_EXTENSION",
            name: "is_installed",
            isInstalled: message.body.isInstalled
        }, "*")
    }
})