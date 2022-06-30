import { atom, AtomEffect } from "recoil";

const storeCartId:  AtomEffect<string> = ({setSelf, onSet}) => {
  const key = "cartId";
  const savedValue = localStorage.getItem(key)
  if (savedValue != null) {
    setSelf(savedValue);
  } else {
    const id = new Date().getTime().toString();
    localStorage.setItem(key, id)
    setSelf(id);
  }

  onSet((newValue, _, isReset) => {
    isReset
      ? localStorage.removeItem(key)
      : localStorage.setItem(key, newValue);
  });
};
export const CartId = atom<string>({key: "cartId", effects: [storeCartId]});