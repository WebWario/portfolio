/**
 * txtMap object containing a txtKey: string and a txtValue: string pair.
 * */
export interface TxtMap {
  txtKey: string;
  txtValue: string;
  txtElements: txtElement[];
  icon?: string;
  image?: string;
  detail?: string;
  link?: string;
  organization?: string;
  subtitle: string;
}

export interface txtElement {
  title: string;
  type: elementTypes;
  elements: string[];
  options?: {
    "link"?:string;
    // map of links associated with the passed elements
    "elementLinks"?: {[elem: string]: string};
  }
}

export type elementTypes = "text" | "list" | "embed" | "img" | "logo"
