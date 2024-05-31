import { nanoid } from "nanoid";
import { Order, Product, ProductTemplate } from "../types";
import {ProductRepository} from "./product.repo";
import {OrderRepository} from "./order.repo";

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
  orders: Order[] = [];

  async create(order: Omit<Order, "id">): Promise<Order> {
    const created = {...order, id: nanoid()};
    this.orders.push(created);
    return created;
  } 

  async findById(orderId: string): Promise<Order | null> {
    return this.orders.find(({id}) => id === orderId) || null;
  }
  
}

