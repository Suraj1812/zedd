import { mkdir, writeFile } from "node:fs/promises";
const assets = {
  food: "photo-1512621776951-a57141f2eefd",
  pizza: "photo-1513104890138-7c749659a591",
  burger: "photo-1568901346375-23c9450c58cd",
  sushi: "photo-1579871494447-9811cf80d66c",
  room: "photo-1611892440504-42a792e24d32",
  coast: "photo-1510414842594-a61c69b5ae57",
  pottery: "photo-1578749556568-bc2c40e68b61",
  bag: "photo-1548036328-c9fa89d128fa",
  car: "photo-1503376780353-7e6692767b70",
  house: "photo-1600596542815-ffad4c1539a9",
  laptop: "photo-1517336714731-489689fd1ca8",
  plane: "photo-1436491865332-7a61a109cc05",
  train: "photo-1474487548417-781cb71495f3",
  event: "photo-1492684223066-81342ee5ff30",
  sam: "photo-1500648767791-00dcc994a43e",
  amelia: "photo-1580489944761-15a19d654956",
  oliver: "photo-1506794778202-cad84cf45f1d",
  taxi: "photo-1449965408869-eaa3f722e40d",
  bus: "photo-1570125909232-eb263c188f7e",
  doctor: "photo-1612349317150-e413f6a5b16d",
};
await mkdir("assets/editorial", { recursive: true });
for (let i = 0; i < Object.entries(assets).length; i += 4) {
  await Promise.all(
    Object.entries(assets)
      .slice(i, i + 4)
      .map(async ([name, id]) => {
        const response = await fetch(
          `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${["sam", "amelia", "oliver", "doctor"].includes(name) ? 400 : 900}&q=85`,
        );
        if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
        await writeFile(
          `assets/editorial/${name}.jpg`,
          new Uint8Array(await response.arrayBuffer()),
        );
        console.log(`Saved ${name}`);
      }),
  );
}
