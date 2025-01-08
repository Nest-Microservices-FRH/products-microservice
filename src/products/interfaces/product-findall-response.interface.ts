import { Product } from '../entities/product.entity';

export interface ProductFindAllResponse {
    data: Product[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
    }