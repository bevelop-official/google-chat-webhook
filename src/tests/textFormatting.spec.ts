import "mocha";
import * as assert from "assert";
import { GoogleChatWebhook } from "../library";

import * as Axios from "axios";
const axios = Axios.default;

describe(`getTextFormatting()`, async () => {
  let client: GoogleChatWebhook;
  beforeEach(async () => {
    client = new GoogleChatWebhook({ url: `https://fantasy.url/`, axiosInstance: axios });
  });

  it(`should return plain text given no formatting options`, async () => {
    const formattedText = client.getFormattedMarkup(`test`);
    assert.equal(formattedText, `test`);
  });

  it(`should return plain text given empty formatting options object`, async () => {
    const formattedText = client.getFormattedMarkup(`test`, {});
    assert.equal(formattedText, `test`);
  });

  it(`should return bold text given bold option`, async () => {
    const formattedText = client.getFormattedMarkup(`test`, { bold: true });
    assert.equal(formattedText, `*test*`);
  });

  it(`should return italic text given italic option`, async () => {
    const formattedText = client.getFormattedMarkup(`test`, { italic: true });
    assert.equal(formattedText, `_test_`);
  });

  it(`should return strikethrough text given strikethrough option`, async () => {
    const formattedText = client.getFormattedMarkup(`test`, { strikethrough: true });
    assert.equal(formattedText, `~test~`);
  });

  it(`should return monospace text given monospace option`, async () => {
    const formattedText = client.getFormattedMarkup(`test`, { monospace: true });
    assert.equal(formattedText, "`test`");
  });

  it(`should return monospaceBlock text given monospaceBlock option`, async () => {
    const formattedText = client.getFormattedMarkup(`test`, { monospaceBlock: true });
    assert.equal(formattedText, "```\ntest\n```");
  });

  it(`should return bold italic strikethrough text given the three options`, async () => {
    const formattedText = client.getFormattedMarkup(`test`, { bold: true, italic: true, strikethrough: true });
    assert.equal(formattedText, "~_*test*_~");
  });
});
