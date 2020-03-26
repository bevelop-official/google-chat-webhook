# google-chat-webhook

An SDK for Google Chats Incoming Webhooks. Enables you to notify Google Chat chatrooms with simple text message threads or high fidelity interactive card interfaces.

_A sample text message thread. Formatting can be done just as in user interface._
![Simple text thread](https://i.imgur.com/nUVMp92.png "Demonstrational text thread")  
_A sample interactive card thread. Embed images, basic html text blocks, rows of buttons and more advanced keyValue widgets._
![Interactive card thread](https://i.imgur.com/M2V44n8.jpg "Demonstrational card thread")  
_Other sample card with keyValue widget._
![Interactive card thread #2](https://i.imgur.com/DhQnKsr.png "Demonstrational card thread #2")

## Table of contents

1. Getting started
2. API
3. Sample
4. Sources

## 1. Getting started

- Create or select an existing chatroom in Google Chat
- Via the settings button choose `Configure Webhooks`
- Create new webhook
- Copy webhooks new URL
- Run the sample

```
WEBHOOK_URL=${YOUR_WEBHOOK_URL_HERE} npm run sample
```

- Explore the sample code in `./sample/index`

## 2. API

- Sending text message

```ts
await client.sendText("This is a basic text thread.");
```

- Formatting text helper

````ts
// ~_*block struck italic text*_~
const formatted = client.getFormattedMarkup(`bold struck italic text`, {
  bold: true,
  italic: true,
  strikethrough: true,
});

// `some inline code`
const monospace = client.getFormattedMarkup(`some inline code`, { monospace: true });

// ```
// multi
// line
// code
// ```
const monospaceBlock = client.getFormattedMarkup(`multi\nline\ncode`, { monospaceBlock: true });
````

- Formatting mention helper

```ts
// <users/all>
const AT_ALL = client.getMentionMarkup(MentionType.ALL);
// <users/sample-user-id>
const userSpecificMention = client.getMentionMarkup(MentionType.USER_SPECIFIC, `sample-user-id`);
```

Given you somehow know the users ID you may use the syntax described in '[Messages that @mention specific users](https://developers.google.com/hangouts/chat/reference/message-formats/basic#messages_that_mention_specific_users)'

- Formatting link helper

```ts
// <https://sample.com/|Sample Website>
const link = client.getLinkMarkup(`https://sample.com/`, `Sample Website`);
// <https://sample.com/|https://sample.com/>
const link = client.getLinkMarkup(`https://sample.com/`);
```

- Sending card message  
  See sample below.

```ts
const card: CardMessage = { ... };
await googleChat.sendCard(card);

```

## 3. Sample

````ts
import { GoogleChatWebhook } from "google-chat-webhook";

const url = process.env.WEBHOOK_URL;
if (!url) {
  throw new Error("Environment variable 'WEBHOOK_URL' must be set.");
}
const client = new GoogleChatWebhook({ url });

/**
 * Send a simple text message to hangouts chat. Formatting is as
 * within the UI.
 * *bold text*
 * _italic text_
 * ~strike text~
 * `inline code`
 * ```
 *   multi-line
 *   code
 * ```
 */
const simpleMessage: GoogleChatWebhook.SimpleTextMessage = `*Bold text*\n\n`inline-code`\n_Italic text_\nUnformatted text\n`;
await client.sendTextMessage(simpleMessage);

/**
 * Send a more complex card message.
 */
 const card: CardMessage = {
    cards: [
      {
        header: {
          title: `Unsplash daily bot`,
          subtitle: `Fresh inspiration every day`,
          imageUrl: `https://www.appgefahren.de/wp-content/uploads/2020/01/unsplash-icon.jpg`,
          imageStyle: CardImageStyle.AVATAR,
        },
        sections: [
          {
            widgets: [
              {
                image: {
                  imageUrl: `https://images.unsplash.com/photo-1541960071727-c531398e7494?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80`,
                },
              },
              {
                buttons: [
                  {
                    imageButton: {
                      icon: BuiltInIcon.BOOKMARK,
                      onClick: {
                        openLink: { url: `https://unsplash.com/photos/wxWulfjN-G0/download?force=true&w=640` },
                      },
                    },
                  },
                  {
                    textButton: {
                      text: `Explore more...`,
                      onClick: {
                        openLink: { url: `https://unsplash.com/` },
                      },
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
  await googleChat.sendCard(card);
````

## Sources

[Google Chat API documentation](https://developers.google.com/hangouts/chat):

- [Use incoming webhooks](https://developers.google.com/hangouts/chat/how-tos/webhooks)
- [Card formatting messages](https://developers.google.com/hangouts/chat/reference/message-formats/cards)
- [Simple text messages](https://developers.google.com/hangouts/chat/reference/message-formats/basic)
