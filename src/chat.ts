export interface IChat {
  key: string;
  author: string;
  message: string;
  element: HTMLElement;
  associatedElements?: HTMLElement[];
}
