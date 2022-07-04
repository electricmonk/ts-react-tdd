const NAMESPACE = "__REACT_TDD_POC";
const STRINGIFIED_OBJECT = "{}";

interface StorageData {
  cartId: string | null;
}

type ValueOf<T> = T[keyof T];

const getAllItems = (): StorageData =>
  // https://github.com/microsoft/TypeScript/issues/43232#issuecomment-798911982
  JSON.parse(localStorage.getItem(NAMESPACE) ?? STRINGIFIED_OBJECT);

const getItem = (key: keyof StorageData) => {
  const items = getAllItems();

  // Prefer nulls as they are explicit
  return items[key] || null;
};

const setItem = (key: keyof StorageData, value: ValueOf<StorageData>) => {
  const previousItems = getAllItems();
  const mergedItems = { ...previousItems, [key]: value };
  localStorage.setItem(NAMESPACE, JSON.stringify(mergedItems));
};

// exporting as default to force the use of something like persistantStorage.getItem...
export default {
  setItem,
  getItem,
};
