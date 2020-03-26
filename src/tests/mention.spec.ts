import { GoogleChatWebhook } from "../library";
import { MentionType } from "../types";
import * as assert from "assert";
import * as Errors from "../errors";

describe(`getMentionMarkup()`, async () => {
  let client: GoogleChatWebhook;
  beforeEach(async () => {
    client = new GoogleChatWebhook({ url: `https://testurl.com/` });
  });

  it(`should return mention markup for all users given type all`, async () => {
    const markup = client.getMentionMarkup(MentionType.ALL);
    assert.equal(markup, `<users/all>`);
  });

  it(`should return mention markup for specific user given type specific user and userId`, async () => {
    const markup = client.getMentionMarkup(MentionType.SPECIFIC_USER, `abc`);
    assert.equal(markup, `<users/abc>`);
  });

  it(`should throw InvalidArgumentsError given type specific user and no userId`, async () => {
    assert.throws(
      () => client.getMentionMarkup(MentionType.SPECIFIC_USER),
      Errors.GoogleChatWebhook.InvalidArgumentError,
    );
  });

  it(`should throw InvalidArgumentsError given type specific user and empty string userId`, async () => {
    assert.throws(
      () => client.getMentionMarkup(MentionType.SPECIFIC_USER, ""),
      Errors.GoogleChatWebhook.InvalidArgumentError,
    );
  });

  it(`should throw an InvalidArgumentError given invalid type`, async () => {
    assert.throws(
      () => client.getMentionMarkup(("something" as unknown) as MentionType),
      Errors.GoogleChatWebhook.InvalidArgumentError,
    );
  });
});
