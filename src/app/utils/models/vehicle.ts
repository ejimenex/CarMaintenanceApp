import { Brand } from "./brand";
import { Model } from "./model";

export interface Vehicle {
    id: string;
    name: string;
    description: string;
    brandId: string;
    modelId: string;
    image: string;
    color: string;
    brand: Brand;
    model: Model;
}