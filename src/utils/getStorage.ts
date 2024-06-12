function getStorage(name: string, storage_type : 'local' | 'session' = 'local'): Object | undefined {
  const item = (storage_type == 'local' ? localStorage : sessionStorage).getItem(name);
  return item ? JSON.parse(item) : undefined;
}

export default getStorage;
