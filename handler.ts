import * as Ask from "ask-sdk";
import { RequestHandler } from "ask-sdk-core";
import axios from "axios";

import { Intent } from "ask-sdk-model";
import "source-map-support/register";
import { ClientConfig, Client, TextMessage } from "@line/bot-sdk";

const sendMessageToDiscordChannel = async (message: string) => {
  const URL = process.env.DISCORD_WEBHOOK;

  const config = {
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  };

  const postData = {
    username: "通知",
    content: message,
  };

  await axios.post(URL, postData, config);
};

const sendMessageHandler: RequestHandler = {
  canHandle: (_) => true,
  handle: async (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    if (request.type === "IntentRequest") {
      const message = createResponseMessage(request.intent.slots);
      await sendMessageToDiscordChannel(message);
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
  .addRequestHandlers(sendMessageHandler)
  .lambda();
