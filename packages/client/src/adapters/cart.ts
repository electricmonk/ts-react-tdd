import axios from "axios";
export interface CartAdapter {
  getCount: () => Promise<number>;
  addItem: () => Promise<void>;
}
export class InMemoryCartAdapter {
  #count = 0;

  async addItem() {
    this.#count++;
  }

  async getCount() {
    return this.#count;
  }
}

export class HTTPCartAdapter {
  constructor(private url: string) {}
  addItem = async () => (await axios.post<void>(`${this.url}/cart`)).data;
  getCount = async () => (await axios.get<number>(`${this.url}/cart`)).data;
}
