import { Model } from "./model";

export interface Brand {
    id: string;
    name: string;
    models: Model[];
}