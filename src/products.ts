export type Product = {
  id: number;
  name: string;
  marketPrice: number;
  salePrice: number;
  category: string;
  available: boolean;
};

type Row = [string, number, number];

const section = (
  category: string,
  start: number,
  rows: Row[]
): Product[] =>
  rows.map(
    ([name, marketPrice, salePrice], index) => ({
      id: start + index,
      name,
      marketPrice,
      salePrice,
      category,
      available: true,
    })
  );

export const products: Product[] = [
  ...section('One Sound Crackers', 1, [
    ['2 ¾ Bird', 40, 8],
    ['3 ½ Lakshmi', 65, 13],
    ['4" Lakshmi', 90, 18],
    ['4" Lakshmi Deluxe', 150, 30],
    ['4" Gold Lakshmi', 160, 32],
    ['2 Sound', 200, 40],
    ['4½" Bahubali', 250, 50],
    ['5" Jallikattu', 300, 60],
    ['6" Lion', 400, 80],
  ]),

  ...section('Deluxe Crackers', 10, [
    ['24 Dlx', 225, 45],
    ['50 Dlx', 550, 110],
    ['100 Dlx', 1000, 200],
  ]),

  ...section('Chorsa & Giant Crackers', 13, [
    ['28 Chorsa', 75, 15],
    ['28 Giant', 100, 20],
    ['56 Giant', 200, 40],
  ]),

  ...section('Bijili', 16, [
    ['Red Bijili (50 Pcs)', 80, 16],
    ['Striped Bijili (50 Pcs)', 90, 18],
    ['Red Bijili (100 Pcs)', 160, 32],
    ['Mirchi (25 Pcs)', 350, 70],
  ]),

  ...section('Ground Chakkar', 20, [
    ['Chakkar Big (10 Pcs)', 225, 45],
    ['Chakkar Ashoka', 350, 70],
    ['Chakkar SPI', 450, 90],
    ['Chakkar DLX', 750, 150],
    ['Chakkar Spinner Ashoka', 450, 90],
    ['Chakkar Spinner SPI', 750, 150],
    ['Chakkar Spinner DLX', 1000, 200],
    ['Wire Chakkar', 1000, 200],
  ]),

  ...section('Flower Pots', 28, [
    ['Flower Pots Small', 300, 60],
    ['Flower Pots Big', 400, 80],
    ['Flower Pots Special', 500, 100],
    ['Flower Pots Asoka', 700, 140],
    ['Flower Pots DLX (5 Pcs)', 900, 180],
    ['Colour Kotti', 1100, 220],
  ]),

  ...section('Walla Garlands', 34, [
    ['100 Wala', 225, 45],
    ['200 Wala', 400, 80],
    ['1000 Wala', 900, 180],
    ['2000 Wala', 1800, 360],
    ['5000 Wala', 4500, 900],
    ['10000 Wala', 9000, 1800],
  ]),

  ...section('Pencil', 40, [
    ['7" Cm Pencil', 150, 30],
    ['Selfie Stick - 3 Pcs', 250, 50],
    ['Smoke Stick - 3 Pcs', 125, 25],
    ['Ultra Pencil - 3 Pcs', 350, 70],
    ['Lala Candle', 850, 170],
    ['Twix', 850, 170],
    ['Goodly', 850, 170],
    ['Minious', 850, 170],
    ['Selfie Stick - 5 Pcs', 750, 150],
  ]),

  ...section('Bombs', 49, [
    ['Bullet Bomb', 125, 25],
    ['Hydro Bomb', 400, 80],
    ['King of King', 500, 100],
    ['Classic Bomb', 750, 150],
    ['Digital Bomb - 9 Ply', 1250, 250],
    ['Vanakam Da Mapla', 1750, 350],
  ]),

  ...section('Paper Bombs', 55, [
    ['1/4 Kg Paper Bomb', 250, 50],
    ['1/2 Kg Paper Bomb', 500, 100],
    ['1 Kg Paper Bomb', 1000, 200],
    ['Colour Paper Bomb', 350, 70],
  ]),

  ...section('Twinkling Star', 59, [
    ['1½" Twinkling Star Small', 150, 30],
    ['4" Twinkling Star Dlx', 350, 70],
  ]),

  ...section('Rockets', 61, [
    ['Baby Rocket', 250, 50],
    ['Rocket Bombs', 350, 70],
    ['Lunic Rocket', 550, 110],
    ['Whisling Rocket', 1000, 200],
  ]),

  ...section('Stone & Cartoon', 65, [
    ['Electric Stone', 50, 10],
    ['Jeez Boo Maa', 50, 10],
    ['Magic Pops', 50, 10],
    ['Aasarde Cartoons (10 Pcs)', 100, 20],
    ['Kit Kat', 150, 30],
    ['Bim Bom', 300, 60],
  ]),

  ...section('Aerial Fancy', 71, [
    ['7 Shots (5 Pcs)', 450, 90],
    ['Sky Shots (5 Pcs)', 300, 60],
    ['1 Up', 900, 180],
    ['3 Up', 900, 180],
    ['Holi Night Drops (6 Pcs)', 1250, 250],
    ['Black and white (with Crackling)', 1250, 250],
  ]),

  ...section('Fancy Fountain Items', 77, [
    ['Colour Rain (5 Pcs)', 500, 100],
    ['Golden Globe (5 Pcs)', 500, 100],
    ['Peacock Feather (5 Pcs)', 600, 120],
    ['Mottu Pattlu Tri Colour (5 Pcs)', 1100, 220],
    ['Tri Colour Fountain (5 Pcs)', 1400, 280],
    ['Tin Beer', 500, 100],
    ['Touch me Falls', 900, 180],
    ['Disco Shower (5 Pcs)', 500, 100],
  ]),

  ...section('Night Fountain Items', 85, [
    ['Photo Flash (5 Pcs)', 400, 80],
    ['Helicopter (5 Pcs)', 500, 100],
    ['Siren (3 Pcs)', 900, 180],
    ['Mini Siren (5 Pcs)', 700, 140],
    ['High Voltage (2 Pcs)', 1200, 240],
    ['Lolli Pop (2 Pcs)', 1200, 240],
    ['90 Wats (3 Pcs)', 900, 180],
    ['Emu Egg', 1000, 200],
  ]),

  ...section('Special Fountain Items', 93, [
    ['Butterfly (10 Pcs)', 450, 90],
    ['Bambaram (10 Pcs)', 600, 120],
    ['Love Dham (6 Shot Color)', 800, 160],
    ['Magic Peacock 3 in 1', 900, 180],
    ['Bada Peacock', 2000, 400],
    ['Money Bank (2 Pcs)', 1250, 250],
    ['Colour Smoke (3 Pcs)', 800, 160],
    ['4 x 4 Wheel (5 Pcs)', 750, 150],
    ['Cracker Queen', 900, 180],
    ['Water Queen', 700, 140],
  ]),

  ...section('Colour Full Fountain Items', 103, [
    ['Tweet', 1000, 200],
    ['6000', 1000, 200],
    ['Poppings', 1000, 200],
    ['Power Pots - 5 Pcs', 1000, 200],
    ['Sun Feast - 5 Pcs', 900, 180],
    ['I Cone - 2 Pcs', 1000, 200],
    ['Gold Star - 3 Pcs', 750, 150],
    ['Golden Sun - 5 Pcs', 1000, 200],
    ['Angry Bird - 5 Pcs', 1500, 300],
  ]),

  ...section('Double Attraction Colour', 113, [
    ['Rainy & Shiny (Fountain with Shot)', 1250, 250],
    ['Tik & Tak (Fountain with Shot)', 1250, 250],
    ['Belly & Jelly (Fountain with Shot)', 1250, 250],
    ['Crack & jack (Fountain with Shot)', 1250, 250],
  ]),

  ...section('Double Attraction Colour', 117, [
    ['Gold Fish (Colour With Crackling)', 1000, 200],
    ['Croods Fish (Red With Crackling)', 1000, 200],
    ['Angel Time (Green With Crackling)', 1000, 200],
  ]),

  ...section('Repeating Cake', 120, [
    ['12 Shot (Rider)', 750, 150],
    ['25 Shot (Rider)', 1200, 240],
    ['30 Shot Multi Colour', 2000, 400],
    ['60 Shot Multi Colour', 4000, 800],
    ['120 Shot Multi Colour', 8000, 1600],
    ['240 Shot Multi Colour', 16000, 3200],
    ['Amazing Wonder 10 x 10 New Shot', 15000, 3000],
  ]),

  ...section('Fancy Items', 127, [
    ['Fancy Chotta', 250, 50],
    ['2" Fancy', 500, 100],
    ['2" Fancy (3 Pcs)', 1350, 270],
    ['3 1/2" Silver Fancy', 1500, 300],
    ['3 1/2" Nayagara Falls', 1600, 320],
    ['3 1/2" Digital Star', 1600, 320],
    ['4" Fancy Double Ball', 2250, 450],
    ['4" Fancy - 7 Step', 1600, 320],
    ['4" Fancy - 2 Pcs', 3500, 700],
    ['6" Fancy', 2250, 450],
    ['Bharath Rathna (2 1/2" Fancy) Set Out', 15000, 3000],
  ]),

  ...section('Electric Sparklers', 138, [
    ['7 Cm Electric Sparkle', 50, 10],
    ['7 Cm Color Sparkle', 65, 13],
    ['7 Cm Green Sparkle', 80, 16],
    ['7 Cm Red Sparkle', 90, 18],
    ['10 Cm Electric Sparkle', 110, 22],
    ['10 Cm Color Sparkle', 125, 25],
    ['10 Cm Green Sparkle', 140, 28],
    ['10 Cm Red Sparkle', 150, 30],
    ['12 Cm Electric Sparkle', 165, 33],
    ['12 Cm Color Sparkle', 175, 35],
    ['12 Cm Green Sparkle', 190, 38],
    ['12 Cm Red Sparkle', 200, 40],
    ['15 Cm Electric Sparkle', 225, 45],
    ['15 Cm Colour Sparkle', 240, 48],
    ['15 Cm Green Sparkle', 265, 53],
    ['15 Cm Red Sparkle', 275, 55],
    ['30 Cm Electric Sparkle (5 Pcs)', 225, 45],
    ['30 Cm Colour Sparkle (5 Pcs)', 240, 48],
    ['30 Cm Green Sparkle (5 Pcs)', 265, 53],
    ['30 Cm Red Sparkle (5 Pcs)', 275, 55],
    ['50 Cm Electric Sparkle (5 Pcs)', 900, 180],
    ['50 Cm Colour Sparkle (5 Pcs)', 1000, 200],
  ]),

  ...section('Other Items', 160, [
    ['Colour Match (3 Box)', 100, 20],
    ['Happy DLX (10 Box)', 400, 80],
    ['Lion Colour Box (10 Box)', 800, 160],
    ['Royal Colour (10 Box)', 1250, 250],
    ['Roll Cap (10 Roll)', 400, 80],
    ['Snake Tablet (10 Box)', 150, 30],
    ['Pop (Onion Crackers) (50 Box)', 2500, 500],
    ['Rock Star', 400, 80],
    ['Dancing Umbrella', 1250, 250],
    ['Parachute', 250, 50],
    ['Cylinder Bomb', 1000, 200],
    ['Vel', 1250, 250],
    ['Hanuman Kadayutham', 1100, 220],
  ]),

  // 🎁 GIFT BOX
  ...section('Gift Box', 173, [
    ['20 Item Gift Box', 280, 280],
    ['25 Item Gift Box', 350, 350],
    ['30 Item Gift Box', 450, 450],
    ['40 Item Gift Box', 550, 550],
    ['50 Item Gift Box', 800, 800],
  ]),

  // 👨‍👩‍👧‍👦 INIYAN FAMILY PACK
  ...section('Family Pack', 178, [
    ['Children Pack', 3000, 3000],
    ['Young Star Pack', 5000, 5000],
    ['Golden Family Pack', 7000, 7000],
  ]),
];
