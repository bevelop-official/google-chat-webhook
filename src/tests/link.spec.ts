import { GoogleChatWebhook } from "../library";
import * as assert from "assert";
import * as Errors from "../errors";

describe(`getLinkMarkup()`, async () => {
  let client: GoogleChatWebhook;
  beforeEach(async () => {
    client = new GoogleChatWebhook({ url: `https://testurl.com/` });
  });

  it(`should return link markup given valid uri and text`, async () => {
    const markup = client.getLinkMarkup(`https://google.com/`, `Google Homepage`);
    assert.equal(markup, `<https://google.com/|Google Homepage>`);
  });

  it(`should return link markup with link as text given no specific text`, async () => {
    const markup = client.getLinkMarkup(`https://google.com/`);
    assert.equal(markup, `<https://google.com/|https://google.com/>`);
  });

  it(`should throw given an invalid uri`, async () => {
    assert.throws(() => {
      client.getLinkMarkup(`no-uri`);
    });
  });
});
