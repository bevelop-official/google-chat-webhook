import "mocha";
import { GoogleChatWebhook } from "../library";
import * as assert from "assert";

import * as Axios from "axios";
const axios = Axios.default;
import { CardMessage, CardImageStyle, BuiltInIcon, MAX_TEXT_MESSAGE_LENGTH } from "../types";

describe(`validation`, async () => {
  let client: GoogleChatWebhook;
  beforeEach(async () => {
    client = new GoogleChatWebhook({ url: `https://fantasy.url/`, axiosInstance: axios });
  });

  describe(`validateCardMessage()`, async () => {
    it(`should return void given valid text paragraph card`, async () => {
      const cardMessage: CardMessage = {
        cards: [
          {
            header: {
              title: `Test title`,
              subtitle: `Test subtitle`,
              imageStyle: CardImageStyle.AVATAR,
              imageUrl: `https://google.com/`,
            },
            sections: [
              {
                widgets: [
                  {
                    textParagraph: { text: `Test paragraph` },
                  },
                ],
              },
            ],
          },
        ],
      };
      await assert.doesNotReject(client["validateCardMessage"](cardMessage));
    });

    it(`should return void given valid mixed widgets card`, async () => {
      const cardMessage: CardMessage = {
        cards: [
          {
            header: {
              title: `Test title`,
              subtitle: `Test subtitle`,
              imageStyle: CardImageStyle.AVATAR,
              imageUrl: `https://google.com/`,
            },
            sections: [
              {
                widgets: [
                  {
                    textParagraph: { text: `Test paragraph` },
                  },
                  {
                    image: {
                      imageUrl: `https://image.com/`,
                    },
                  },
                  {
                    keyValue: {
                      topLabel: `Some top label`,
                      content: `This is some multiline content\nNext line begins here`,
                      contentMultiline: true,
                      bottomLabel: `Some bottom label`,
                      onClick: { openLink: { url: `https://google.com/` } },
                      icon: BuiltInIcon.AIRPLANE,
                    },
                  },
                  {
                    buttons: [
                      { textButton: { text: `Click me`, onClick: { openLink: { url: `https://some.de/` } } } },
                      {
                        imageButton: {
                          icon: BuiltInIcon.AIRPLANE,
                          onClick: { openLink: { url: `https://some.other.de/` } },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
      await assert.doesNotReject(client["validateCardMessage"](cardMessage));
    });

    it(`should throw an error given no cards`, async () => {
      const cardMessage: CardMessage = { cards: [] };
      await assert.rejects(client["validateCardMessage"](cardMessage));
    });

    it(`should throw an error given now sections in card`, async () => {
      const cardMessage: CardMessage = { cards: [{ sections: [] }] };
      await assert.rejects(client["validateCardMessage"](cardMessage));
    });

    it(`should throw an error given multiple button types in one button`, async () => {
      const cardMessage: CardMessage = {
        cards: [
          {
            sections: [
              {
                widgets: [
                  {
                    buttons: [
                      {
                        imageButton: { icon: BuiltInIcon.AIRPLANE, onClick: { openLink: { url: `https://test.de/` } } },
                        textButton: { text: `Testing`, onClick: { openLink: { url: `https://hallo.de` } } },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
      await assert.rejects(client["validateCardMessage"](cardMessage));
    });

    it(`should throw an error given keyValue widget with both icon and custom icon`, async () => {
      const cardMessage: CardMessage = {
        cards: [
          {
            sections: [
              {
                widgets: [
                  {
                    keyValue: { icon: BuiltInIcon.AIRPLANE, iconUrl: `https://image.com/url.png` },
                  },
                ],
              },
            ],
          },
        ],
      };
      await assert.rejects(client["validateCardMessage"](cardMessage));
    });
  });

  describe(`validateTextMessage()`, async () => {
    it(`should return void given valid text input`, async () => {
      const message = "test message";
      assert.doesNotThrow(() => client["validateTextMessage"](message));
    });

    it(`should throw given number`, async () => {
      const message = (1234 as unknown) as string;
      assert.throws(() => client["validateTextMessage"](message));
    });

    it(`should throw given null`, async () => {
      const message = (null as unknown) as string;
      assert.throws(() => client["validateTextMessage"](message));
    });

    it(`should throw given empty string`, async () => {
      const message = "";
      assert.throws(() => client["validateTextMessage"](message));
    });

    it(`should throw given too long string`, async () => {
      const message = "a".repeat(MAX_TEXT_MESSAGE_LENGTH + 1);
      assert.throws(() => client["validateTextMessage"](message));
    });
  });
});
