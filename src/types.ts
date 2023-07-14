export type TUser = {
    id: string
    name: string
    email: string
    password: string
    created_at: string
}

export type TProduct = {
    id: string
    name: string
    price: number
    description: string
    category: Category
    image_url: string
}

export type TPurchase = {
    id: string
    buyer: string
    total_price: number
    created_at: string
    paid: number
}

export type TPurchaseProduct ={
    purchase_id:string,
    product_id:string,
    quantity:number
}

export enum Category {
    
    INFORMATICA = "Informática"
}