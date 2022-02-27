export default class InMemoryCartAdapter {
  #count = 0;

  async addItem() {
    this.#count++;
  }

  async getCount() {
    return this.#count;
  }
}
