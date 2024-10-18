async function migrateV1() {
  const key = "blockedUserIDs@89f186cd-f6ba-530d-b8b2-171f916d8888";
  const oldValue = await GM.getValue(key);
  if (!oldValue) {
    return;
  }
  const newValue: Record<string, true> = {};
  (JSON.parse(String(oldValue)) as string[]).forEach((i) => {
    newValue[i] = true;
  });
  await GM.setValue(
    "blockedUsers@b020a2c5-0839-5573-9fcf-7eba106ff8c4",
    JSON.stringify(newValue)
  );
  await GM.deleteValue(key);
}

export default async function migrate() {
  await migrateV1();
}
