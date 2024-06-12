function removeStorage(name: string, storage_type : 'local' | 'session' = 'local') {
  (storage_type == 'local' ? localStorage : sessionStorage).removeItem(name);
}

export default removeStorage;
