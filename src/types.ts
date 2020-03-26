export type TextMessage = string;

export const MAX_TEXT_MESSAGE_LENGTH = 4096;

export interface ConstructorOptions {
  url: string;
  axiosInstance?: any; // TODO: check for axios instance interface definition
}

export interface CardMessage {
  cards?: Card[];
}

export interface Card {
  header?: Header;
  sections?: Section[];
}

export enum CardImageStyle {
  IMAGE = "IMAGE",
  AVATAR = "AVATAR",
}

export interface Header {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  imageStyle?: CardImageStyle;
}

export interface Section {
  widgets?: Widget[];
}

export interface Widget {
  keyValue?: KeyValue;
  textParagraph?: TextParagraph;
  buttons?: Button[];
  image?: Image;
}

export interface Image {
  imageUrl: string;
  onClick?: OnClick;
}

export interface KeyValue {
  topLabel?: string;
  content?: string;
  contentMultiline?: boolean;
  bottomLabel?: string;
  onClick?: OnClick;
  icon?: BuiltInIcon;
  iconUrl?: string;
  button?: Button;
}

export enum BuiltInIcon {
  AIRPLANE = "AIRPLANE",
  BOOKMARK = "BOOKMARK",
  BUS = "BUS",
  CAR = "CAR",
  CLOCK = "CLOCK",
  CONFIRMATION_NUMBER_ICON = "CONFIRMATION_NUMBER_ICON",
  DESCRIPTION = "DESCRIPTION",
  DOLLAR = "DOLLAR",
  EMAIL = "EMAIL",
  EVENT_SEAT = "EVENT_SEAT",
  FLIGHT_ARRIVAL = "FLIGHT_ARRIVAL",
  FLIGHT_DEPARTURE = "FLIGHT_DEPARTURE",
  HOTEL = "HOTEL",
  HOTEL_ROOM_TYPE = "HOTEL_ROOM_TYPE",
  INVITE = "INVITE",
  MAP_PIN = "MAP_PIN",
  MEMBERSHIP = "MEMBERSHIP",
  MULTIPLE_PEOPLE = "MULTIPLE_PEOPLE",
  PERSON = "PERSON",
  PHONE = "PHONE",
  RESTAURANT_ICON = "RESTAURANT_ICON",
  SHOPPING_CART = "SHOPPING_CART",
  STAR = "STAR",
  STORE = "STORE",
  TICKET = "TICKET",
  TRAIN = "TRAIN",
  VIDEO_CAMERA = "VIDEO_CAMERA",
  VIDEO_PLAY = "VIDEO_PLAY",
}

export interface TextParagraph {
  text: string;
}

export interface Button {
  textButton?: TextButton;
  imageButton?: ImageButton;
}

export interface BaseButton {
  onClick?: OnClick;
}

export interface TextButton extends BaseButton {
  text: string;
}

export interface ImageButton extends BaseButton {
  iconUrl?: string;
  icon?: BuiltInIcon;
}

export interface OnClick {
  openLink: { url: string };
}

export interface SuccessResponse {
  name?: string;
  sender?: Sender;
  text?: string;
  cards?: Card[];
  previewText?: string;
  annotations?: any[];
  thread?: Thread;
  space?: Space;
  fallbackText?: string;
  argumentText?: string;
  createTime?: Date;
}

export interface Sender {
  name?: string;
  displayName?: string;
  avatarUrl?: string;
  email?: string;
  domainId?: string;
  type?: string;
}

export interface Space {
  name?: string;
  type?: string;
  displayName?: string;
}

export interface Thread {
  name?: string;
}

export interface ErrorResponse {
  error?: Error;
}

export interface Error {
  code?: number;
  message?: string;
  status?: string;
  details?: Detail[];
}

export interface Detail {
  "@type"?: string;
  fieldViolations?: FieldViolation[];
}

export interface FieldViolation {
  field?: string;
  description?: string;
}

export interface AuthenticationQueryParameters {
  key: string;
  token: string;
}

export interface TextFormattingOptions {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  monospace?: boolean;
  monospaceBlock?: boolean;
}

export enum MentionType {
  ALL = "ALL",
  SPECIFIC_USER = "SPECIFIC_USER",
}
