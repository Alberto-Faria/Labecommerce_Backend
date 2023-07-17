import { TUser, TProduct, TPurchase, Category } from "./types";

export const users: TUser[] = [
    {
        id: "1",
        name: "Beto",
        email: "beto@gmail.com",
        password: "123456",
        created_at: ""
    },  
    {
        id: "2",
        name: "Clebia",
        email: "clebia@gmail.com",
        password: "123456",
        created_at: ""       
    }
];

export const products: TProduct[] = [
    {
        id: "1",
        name: "Mouse",
        price: 20,
        description: "Mouse Sem Fio",
        category: Category.INFORMATICA,
        image_url: "https://m.media-amazon.com/images/I/81+qAtwLvZL._AC_SX679_.jpg"
    },
    {
        id: "2",
        name: "SSD",
        price: 154,
        description: "HD SSD Kingston",
        category: Category.INFORMATICA,
        image_url: "https://m.media-amazon.com/images/I/81Yleainj1L._AC_SX679_.jpg"
    }
];

export const purchases: TPurchase[] = [
    {
        id: "1",
        buyer: "1",
        total_price: 20,
        created_at: "",
        paid: 0 
    },
    {
      id: "2",
      buyer: "2",
      total_price: 308,
      created_at: "",
      paid: 0 
    }
];

  export function getAllUsers(users: TUser[]) : TUser[] {
    return users
  }
  

  export function getUserById(id: string) {
    const user = users.find((user) => user.id === id)
    return user
}

  export function getAllProducts(products: TProduct[]) : TProduct[] {
    return products
  }
  
  export function getProductById(idToSearch: string) : TProduct[] | undefined {
    return products.filter((product: TProduct) => {
      return product.id === idToSearch
    })
  }
  
  export function queryProductsByName (q: string) : TProduct[] {
    return products.filter((product: TProduct) => {
        return product.name.toLowerCase() === q
    })
  }
  
  
  export function getAllPurchasesFromUserId (id: string) : TPurchase[] | undefined {
    return purchases.filter((purchase) => {
        return purchase.id === id
    })

}