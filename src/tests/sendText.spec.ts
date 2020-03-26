import "mocha";
import { GoogleChatWebhook } from "../library";
import * as assert from "assert";
import * as Axios from "axios";
const axios = Axios.default;
import { MAX_TEXT_MESSAGE_LENGTH } from "../types";
import Joi = require("@hapi/joi");
import * as simple from "simple-mock";
import * as Errors from "../errors";

describe(`sendText()`, async () => {
  let client: GoogleChatWebhook;
  const endpoint = `https://test.url/`;
  beforeEach(async () => {
    client = new GoogleChatWebhook({ url: endpoint, axiosInstance: axios });
  });

  afterEach(async () => {
    simple.restore();
  });

  it(`should return success response given valid request`, async () => {
    const successResponse = {
      name: "spaces/AAAAObjNOy4/messages/ykXCt3Anj0c.ykXCt3Anj0c",
      sender: {
        name: "users/114022495153014004089",
        displayName: "Importer Status Bot",
        avatarUrl: "",
        email: "",
        domainId: "",
        type: "BOT",
      },
      text:
        "*2020-03-26T14:50:23Z* | `customer-importer` has completed with errors\n\nError excerpt:\n```\nSomething went wrong. We don't know what.\n```\n\nJob will be rescheduled automatically.\nThe job ran for _23 seconds_ between `2020-03-26T14:50:00Z` and `2020-03-26T14:50:23Z` and the id `72AEF-132LO-J0B-TEST-ID`",
      cards: [],
      previewText: "",
      annotations: [],
      thread: {
        name: "spaces/AAAAObjNOy4/threads/ykXCt3Anj0c",
      },
      space: {
        name: "spaces/AAAAObjNOy4",
        type: "ROOM",
        displayName: "YKK / DevOps",
      },
      fallbackText: "",
      argumentText:
        "*2020-03-26T14:50:23Z* | `customer-importer` has completed with errors\n\nError excerpt:\n```\nSomething went wrong. We don't know what.\n```\n\nJob will be rescheduled automatically.\nThe job ran for _23 seconds_ between `2020-03-26T14:50:00Z` and `2020-03-26T14:50:23Z` and the id `72AEF-132LO-J0B-TEST-ID`",
      createTime: "2020-03-27T08:33:12.301359Z",
    };
    simple.mock(axios, "request", async () => {
      return { data: successResponse };
    });
    const response = await client.sendText(`test text`);
    assert.deepEqual(response, successResponse);
  });

  it(`should throw error response given number casted to string`, async () => {
    await assert.rejects(client.sendText((1234 as unknown) as string), Joi.ValidationError);
  });

  it(`should throw an error given too long input`, async () => {
    await assert.rejects(client.sendText("a".repeat(MAX_TEXT_MESSAGE_LENGTH + 1)), Joi.ValidationError);
  });

  it(`should throw UnknownError given non 200 status code response`, async () => {
    simple.mock(axios, "request", async () => {
      // axios will throw given status code >= 4xx
      throw {
        code: 400,
        status: 400,
        response: {},
      };
    });
    await assert.rejects(client.sendText(`abc, something goes wrong`), Errors.GoogleChatWebhook.UnknownError);
  });
});
