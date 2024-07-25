import type { PlasmoMessaging } from "@plasmohq/messaging"
import Browser from "webextension-polyfill";
import * as _ from 'lodash-es'
const handler: PlasmoMessaging.MessageHandler = async (req: any, res: any) => {
    res.send(true);
}

export default handler