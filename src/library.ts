import * as Types from "./types";
import * as Errors from "./errors";
import * as Axios from "axios";
import * as Joi from "@hapi/joi";
const defaultAxios = Axios.default;

export * from "./types";

/**
 * Client SDK for Google Chat Webhook message sending
 */
export class GoogleChatWebhook {
  private axios: Axios.AxiosInstance;

  constructor(private options: Types.ConstructorOptions) {
    if (this.options.axiosInstance) {
      this.axios = this.options.axiosInstance;
    } else {
      this.axios = defaultAxios;
    }
  }

  /**
   * Creates new simple text message thread in Google Chat. Returns Google Chat Webhook response.
   * @param {GoogleChatWebhook.TextMessage} text
   * @returns {Promise<GoogleChatWebhook.SuccessResponse>}
   * @throws {GoogleChatWebhook.InvalidArgumentError}
   * @throws {GoogleChatWebhook.UnknownError}
   */
  public async sendText(text: Types.TextMessage): Promise<Types.SuccessResponse> {
    this.validateTextMessage(text);
    try {
      const requestOptions: Axios.AxiosRequestConfig = {
        method: `POST`,
        url: this.options.url,
        data: { text },
      };
      const response = await this.axios.request<Types.SuccessResponse>(requestOptions);
      return response.data;
    } catch (error) {
      console.error({ message: `Google Chat Webhook API threw an error`, thrownAt: new Date().toISOString(), error });
      throw new Errors.GoogleChatWebhook.UnknownError();
    }
  }

  /**
   * Creates new card message thread in Google Chat. Returns Google Chat Webhook response.
   * @param {CardMessage} card
   * @returns {Promise<Types.SuccessResponse>}
   * @throws {UnknownError}
   */
  public async sendCard(card: Types.CardMessage): Promise<Types.SuccessResponse> {
    await this.validateCardMessage(card);
    try {
      const requestOptions: Axios.AxiosRequestConfig = {
        method: `post`,
        url: this.options.url,
        data: card,
      };
      const response = await this.axios.request<Types.SuccessResponse>(requestOptions);
      return response.data;
    } catch (error) {
      console.error({ message: `Google Chat Webhook API threw an error`, thrownAt: new Date().toISOString(), error });
      throw new Errors.GoogleChatWebhook.UnknownError();
    }
  }

  /**
   * Returns simple formatted text depending on formatting options provided.
   * @param {string} text
   * @param {GoogleChatWebhook.TextFormattingOptions} formattingOptions
   * @returns {string}
   * @throws {UnknownError}
   */
  public getFormattedMarkup(text: string, formattingOptions?: Types.TextFormattingOptions): string {
    const options = Object.assign(
      {
        bold: false,
        italic: false,
        strikethrough: false,
        monospace: false,
        monospaceBlock: false,
      },
      formattingOptions,
    );

    if (options.bold) {
      text = `*${text}*`;
    }
    if (options.italic) {
      text = `_${text}_`;
    }
    if (options.strikethrough) {
      text = `~${text}~`;
    }
    if (options.monospace) {
      text = `\`${text}\``;
    }
    if (options.monospaceBlock) {
      text = "```\n" + text + "\n```";
    }

    return text;
  }

  /**
   * Returns special mention markup string for Google Chat.
   * @param {Types.MentionType} type
   * @param {string} [userId] - id of specific user to mention
   * @returns {string}
   * @throws {InvalidArgumentError}
   */
  public getMentionMarkup(type: Types.MentionType, userId?: string): string {
    if (type === Types.MentionType.ALL) {
      return `<users/all>`;
    } else if (type === Types.MentionType.SPECIFIC_USER) {
      if (!userId || userId.length === 0) {
        throw new Errors.GoogleChatWebhook.InvalidArgumentError(
          `userId`,
          userId,
          `UserId must be set if type is 'SPECIFIC_USER'`,
          false,
        );
      }
      return `<users/${userId}>`;
    } else {
      throw new Errors.GoogleChatWebhook.InvalidArgumentError(`type`, type);
    }
  }

  /**
   * Returns Google Chat URI markup.
   * @param {string} uri
   * @param {string} text
   * @returns {string}
   * @throws {Joi.ValidationError | Joi.ValidationError[]}
   */
  public getLinkMarkup(uri: string, text?: string): string {
    const uriSchema = Joi.string().uri().required();
    const { errors, error } = uriSchema.validate(uri);
    if (errors || error) {
      throw errors || error;
    }

    if (!text) {
      text = uri;
    }

    return `<${uri}|${text}>`;
  }

  /**
   * Returns void given valid input data. Throws ValidationError given invalid input data.
   * @param {TextMessage} text
   * @throws {Joi.ValidationError | Joi.ValidationError[]}
   */
  private validateTextMessage(text: Types.TextMessage): void {
    const schema = Joi.string().min(1).max(Types.MAX_TEXT_MESSAGE_LENGTH).required();
    const { errors, error } = schema.validate(text);
    if (!errors && !error) {
      return;
    }

    console.error({
      message: `Text message must be between 1 and 4096 characters.`,
      thrownAt: new Date().toISOString(),
      details: errors || error,
    });
    throw errors || error;
  }

  /**
   * Returns void given valid data and throws a Joi.ValidationError given invalid data.
   * @param {CardMessage} card
   * @returns {Promise<void>}
   * @throws {Joi.ValidationError | Joi.ValidationError[]}
   */
  private async validateCardMessage(card: Types.CardMessage): Promise<void> {
    const onClickSchema = Joi.object({
      openLink: Joi.object({
        url: Joi.string().uri().required(),
      }).required(),
    });
    const buttonSchema = Joi.alternatives([
      Joi.object({
        textButton: Joi.object({
          text: Joi.string().required(),
          onClick: onClickSchema.required(),
        }),
      }),
      Joi.object({
        imageButton: Joi.alternatives([
          Joi.object({
            icon: Joi.allow(...Object.values(Types.BuiltInIcon)).required(),
            onClick: onClickSchema.required(),
          }),
          Joi.object({
            iconUrl: Joi.string().uri().required(),
            onClick: onClickSchema.required(),
          }),
        ]),
      }),
    ]);
    const schema = Joi.object({
      cards: Joi.array()
        .min(1)
        .items(
          Joi.object({
            header: Joi.object({
              title: Joi.string(),
              subtitle: Joi.string(),
              imageUrl: Joi.string().uri(),
              imageStyle: Joi.allow(...Object.values(Types.CardImageStyle)),
            }),
            sections: Joi.array()
              .min(1)
              .items(
                Joi.object({
                  widgets: Joi.array()
                    .min(1)
                    .items(
                      Joi.object()
                        .keys({
                          textParagraph: Joi.object({ text: Joi.string().required() }),
                          keyValue: Joi.alternatives([
                            Joi.object({
                              topLabel: Joi.string(),
                              content: Joi.string(),
                              bottomLabel: Joi.string(),
                              onClick: onClickSchema,
                              contentMultiline: Joi.boolean(),
                              icon: Joi.allow(...Object.values(Types.BuiltInIcon)),
                            }),
                            Joi.object({
                              topLabel: Joi.string(),
                              content: Joi.string(),
                              bottomLabel: Joi.string(),
                              onClick: onClickSchema,
                              contentMultiline: Joi.boolean(),
                              iconUrl: Joi.string().uri(),
                            }),
                          ]),
                          image: Joi.object({
                            imageUrl: Joi.string().uri().required(),
                            onClick: onClickSchema,
                          }),
                          buttons: Joi.array().min(1).items(buttonSchema),
                        })
                        .xor("textParagraph", "keyValue", "image", "buttons"),
                    ),
                }),
              ),
          }),
        ),
    });
    try {
      await schema.validateAsync(card);
    } catch (error) {
      console.error({ message: `cardMessage validation failed`, validationResult: error });
      throw error;
    }
  }
}
