import { Ref } from "vue";

/*
// helpers
*/
export type Reffed<T extends unknown[]> = T extends (infer U)[]
  ? (Ref<U | null> | U)[]
  : never;

/*
// functions
*/
export type VoidFunction = () => void;
export type BooleanFunction = () => void;
// post and patch
export type RequestFunction = (
  data: JsonModel, // eslint-disable-line no-unused-vars
  item?: DjangoModel, // eslint-disable-line no-unused-vars
) => Promise<JsonModel>;
// get
export type GetMultipleFunction = (
  data?: DjangoModel, // eslint-disable-line no-unused-vars
) => Promise<DjangoModel[]>;
export type GetSingleFunction = (id: number | string) => Promise<DjangoModel>; // eslint-disable-line no-unused-vars
// delete
export type DeleteFunction = (
  data: JsonModel, // eslint-disable-line no-unused-vars
  item?: DjangoModel, // eslint-disable-line no-unused-vars
) => Promise<void>;

/*
// models
*/
export type JsonValues =
  | string
  | boolean
  | number
  | Date
  | null
  | number[]
  | string[];

export type JsonModel = {
  // [key: string]: JsonValues | JsonModel | JsonModel[];
  [key: string]: any; // eslint-disable-line
};

export type DjangoModel = { id: number; url?: string; type?: string };

/*
// errors
*/
export interface DjangoError {
  [key: string]: string[] | string;
}
