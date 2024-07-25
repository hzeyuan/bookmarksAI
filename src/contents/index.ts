import { sendToBackground } from "@plasmohq/messaging"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: ["http://localhost:1947/*"],
    all_frames: false,
    run_at: "document_end",
    world: "MAIN"
}




