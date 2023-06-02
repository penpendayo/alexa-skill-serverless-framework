import * as Ask from "ask-sdk";
import { RequestHandler } from "ask-sdk-core";
import { Intent } from "ask-sdk-model";
import "source-map-support/register";
import { ClientConfig, Client, TextMessage } from "@line/bot-sdk";

const sendMessageToLineGroup = async (message: string) => {
  const GROUP_ID = process.env.LINE_GROUP_ID;

  const lineClient = new Client({
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
  } satisfies ClientConfig);

  await lineClient.pushMessage(GROUP_ID, {
    type: "text",
    text: message,
  } satisfies TextMessage);
};

const sendMessageToLineGroupHandler: RequestHandler = {
  canHandle: (_handlerInput) => true,
  handle: async (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    if (request.type === "IntentRequest") {
      const message = createResponseMessage(request.intent.slots);
      await sendMessageToLineGroup(message);
    }
    return handlerInput.responseBuilder.getResponse();
  },
};
const createResponseMessage = (slots: Intent["slots"]) => {
  const human = slots.human.value as "かなこ" | "しんご";
  const action = slots.action.value as "起床" | "就寝";
  const emoji = action === "起床" ? "🌞" : "💤";
  const message = `${emoji}:${human}${action}`;
  return message;
};

export const alexa = Ask.SkillBuilders.custom()
  .addRequestHandlers(sendMessageToLineGroupHandler)
  .lambda();
