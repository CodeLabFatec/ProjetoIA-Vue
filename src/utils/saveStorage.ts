function saveStorage(name: string, object: Object, storage_type : 'local' | 'session' = 'local') {
  (storage_type == 'local' ? localStorage : sessionStorage).setItem(name, JSON.stringify(object));
}

export default saveStorage;