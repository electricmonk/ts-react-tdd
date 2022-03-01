import axios from "axios";
import { ProductCount } from "@ts-react-tdd/server";

export interface CartAdapter {
  getCount: (cartId: string) => Promise<number>;
  addItem: (cartId: string) => Promise<void>;
}
export class InMemoryCartAdapter {
  #sessions: Record<string, number> = {};

  async addItem(cartId: string) {
    this.#sessions[cartId] = this.#sessions[cartId]
      ? this.#sessions[cartId]++
      : 1;
  }

  async getCount(cartId: string): Promise<ProductCount> {
    return this.#sessions[cartId] || 0;
  }
}

export class HTTPCartAdapter {
  constructor(private url: string) {}
  addItem = async (cartId: string) =>
    (await axios.post<void>(`${this.url}/cart/${cartId}`)).data;
  getCount = async (cartId: string) =>
    (await axios.get<number>(`${this.url}/cart/${cartId}`)).data;
}
