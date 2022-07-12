import { OrderRepository, ProductRepository } from "@ts-react-tdd/server/src/routes";
import { createServerLogic } from "@ts-react-tdd/server/src/server";
import { Order, Product } from "@ts-react-tdd/server/src/types";
import { nanoid } from "nanoid";
import { unwireHttpCalls, wireHttpCallsTo } from "./express.http.bridge";
import { HTTPShopBackend } from "./HTTPShopBackend";

type ProductTemplate = Omit<Product,"id">
export class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = []

  constructor(products: ProductTemplate[] = []) {
    products.forEach(p => this.create(p));
  }
  
  async findById(productId: string): Promise<Product | undefined> {
    return this.products.find(product => product.id === productId);
  }
  
  async create(template: Omit<Product, "id">): Promise<Product> {
    const product = {...template, id: nanoid()};
    this.products.push(product);
    return product;
  }
  async findAll(): Promise<Product[]> {
    return this.products;
  }
}

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[] = [];

  async create(order: Omit<Order, "id">): Promise<Order> {
    const created = {...order, id: nanoid()};
    this.orders.push(created);
    return created;
  } 

  async findById(orderId: string): Promise<Order | null> {
    return this.orders.find(({id}) => id === orderId) || null;
  }
  
}
export function inMemoryServerLogic(products: ProductTemplate[] = []) {
  const productRepo = new InMemoryProductRepository(products);
  const logic = createServerLogic(productRepo, new InMemoryOrderRepository());
  wireHttpCallsTo(logic);
  return {
        backend: new HTTPShopBackend(''),
        createProduct: productRepo.create.bind(productRepo),
        unwire: unwireHttpCalls,
  };
}

