export interface IIdentifyContactResponse {
  primaryContactId?: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}
