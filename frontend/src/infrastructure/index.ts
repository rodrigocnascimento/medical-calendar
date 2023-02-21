import Http from "./adapter/http";
import Storage from "./adapter/storage";
import TokenStorage from "./adapter/storage/token";

interface IStorageConcrete {
  local: Storage;
  token: TokenStorage;
}

export interface IInfrastructures {
  http: Http;
  storage: IStorageConcrete;
}

const storage = {
  local: new Storage(localStorage),
} as IStorageConcrete;
storage.token = new TokenStorage(storage.local);

export default function BaseInfrastructure(): IInfrastructures {
  return {
    http: new Http(),
    storage: storage as IInfrastructures["storage"],
  };
}
