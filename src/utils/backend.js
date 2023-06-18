import { Database } from "@tableland/sdk";
import { Registry } from "@tableland/sdk";
// secureStamp_314159_239;
export async function createTable(signer) {
  const db = new Database(signer);

  const { meta: userTable } = await db
    .prepare(
      `
    CREATE TABLE 
        secureStamp
    (   
       numFile INTEGER,
       cid TEXT,
       hash TEXT,
       title TEXT
    );
  `
    )
    .run();

  await console.log(userTable.txn.name);

  return allPetition.txn.name;
}

export async function addCommit(signer) {
  const db = new Database(signer);
  const { meta: addPetition } = await db
    .prepare(
      `INSERT INTO ${"secureStamp_314159_239"} (numFile,cid,hash,title) VALUES
    ( ?,?,?,?);
    `
    )
    .bind(1, "cid", "hash", "title1")
    .run();
  // Wait for transaction finality
  await addPetition.txn.wait();
}

export async function readData() {
  const db = new Database();
  const { results } = await db
    .prepare(`SELECT * FROM ${"secureStamp_314159_239"};`)
    .all();

  console.log(results);
  return results;
}

export async function getTables(signer) {
  // const db = new Database();
  // const { results } = await db
  //   .prepare(`.listTables(0xbce910FAF9Ba3a0795d4D9E414dc52c2fCD5a587);`)
  //   .all();
  // const res = await Registry.listTables(
  //   { signer },
  //   "0xbce910FAF9Ba3a0795d4D9E414dc52c2fCD5a587"
  // );
  const reg = await new Registry({ signer });
  const results = await reg.listTables();
  console.log(results);
  return results;
}
