export interface Manga {
  id: string;
  type: string;
  attributes: {
    title: { [key: string]: string };
    description: { [key: string]: string };
  };
  relationships: Relationship[];
}

export interface Relationship {
  id: string;
  type: string;
  attributes?: {
    fileName?: string;
  };
}

export interface Chapter {
  id: string;
  type: string;
  attributes: {
    chapter?: string;
  };
}
