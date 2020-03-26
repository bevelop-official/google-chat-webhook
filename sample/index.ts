import { GoogleChatWebhook, CardMessage, CardImageStyle, BuiltInIcon } from "../dist/library";

const url = process.env.WEBHOOK_URL;
if (!url) {
  throw new Error(`Please fill environment variable 'WEBHOOK_URL' with a valid Google Chat Webhook URL.`);
}
const googleChat = new GoogleChatWebhook({ url });

async function main(): Promise<void> {
  const heading = googleChat.getFormattedText(`Status update (${new Date().toISOString()})`, { bold: true });
  const code = googleChat.getFormattedText(
    `This is a monospace block.\nWe can use it for code or other special markup needs.`,
    { monospaceBlock: true },
  );
  const text = `${heading}\n${code}`;
  await googleChat.sendText(text);

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
}

main().catch((error) => {
  console.error({ error });
});
