import "mocha";
import { GoogleChatWebhook } from "../library";
import * as assert from "assert";
import * as Axios from "axios";
const axios = Axios.default;
import { CardMessage, CardImageStyle } from "../types";
import * as simple from "simple-mock";
import * as Errors from "../errors";

describe(`sendCard()`, async () => {
  let client: GoogleChatWebhook;
  let successResponse: object, errorResponse: object;
  let cardMessage: CardMessage;
  const endpoint = `https://test.url/`;

  beforeEach(async () => {
    successResponse = {
      name: "spaces/AAAAObjNOy4/messages/drSclAwuXao.drSclAwuXao",
      sender: {
        name: "users/114022495153014004089",
        displayName: "Importer Status Bot",
        avatarUrl: "",
        email: "",
        domainId: "",
        type: "BOT",
      },
      text: "",
      cards: [
        {
          header: {
            title: "Some card",
            subtitle: "subtitle",
            imageStyle: "AVATAR",
            imageUrl: "https://via.placeholder.com/150",
            imageAltText: "",
          },
          sections: [
            {
              header: "",
              widgets: [
                {
                  textParagraph: {
                    text: "Hello world<br>This 'google-chat-webhook' SDK for node.",
                  },
                  buttons: [],
                },
              ],
              collapsable: false,
              uncollapsableWidgetsCount: 0,
            },
          ],
          cardActions: [],
          name: "",
        },
      ],
      previewText: "",
      annotations: [],
      thread: {
        name: "spaces/AAAAObjNOy4/threads/drSclAwuXao",
      },
      space: {
        name: "spaces/AAAAObjNOy4",
        type: "ROOM",
        displayName: "YKK / DevOps",
      },
      fallbackText: "",
      argumentText: "",
      createTime: "2020-03-27T09:19:31.511487Z",
    };
    cardMessage = {
      cards: [
        {
          header: {
            title: `Some card`,
            subtitle: `subtitle`,
            imageStyle: CardImageStyle.AVATAR,
            imageUrl: `https://via.placeholder.com/150`,
          },
          sections: [
            {
              widgets: [
                {
                  textParagraph: { text: `Hello world<br>This 'google-chat-webhook' SDK for node.` },
                },
              ],
            },
          ],
        },
      ],
    };
    client = new GoogleChatWebhook({ url: endpoint, axiosInstance: axios });
  });

  afterEach(async () => {
    simple.restore();
  });

  it(`should return success response given valid data`, async () => {
    simple.mock(axios, "request", () => {
      return { data: successResponse, status: 200, code: 200 };
    });
    const response = await client.sendCard(cardMessage);
    assert.deepEqual(response, successResponse);
  });

  it(`should throw UnknownError given an error response status`, async () => {
    simple.mock(axios, `request`, async () => {
      throw {
        status: 400,
        code: 400,
        response: {},
      };
    });
    await assert.rejects(client.sendCard(cardMessage), Errors.GoogleChatWebhook.UnknownError);
  });
});
