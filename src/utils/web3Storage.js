import { Web3Storage } from "web3.storage";

function getAccessToken() {
  return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

export async function uploadWeb3(file) {
  if (file) {
    const client = makeStorageClient();
    const cid = await client.put(file);
    console.log("web3 Storage cid: " + cid);
    return cid;
  }
}
