import { Resource } from "./approach/Resource/Resource";

let url = 'MariaDB://db.host/instances[rate gt 1000]/myDatabase/myTable[! price le 250 $ 5 AND id eq 1, status: active, updated: 12-31-2022][id, name].getFile()?hello=world';

Resource.parseURI(url);
