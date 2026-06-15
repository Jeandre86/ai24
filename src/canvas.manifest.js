export const manifest = {
  screens: {
    scr_ij1n6u: { name: "Home", route: "/", position: { "x": 160, "y": 1820 } },
    scr_azjimz: { name: "Explore", route: "/explore", position: { "x": 1560, "y": 1820 } },
    scr_xapy4c: { name: "Curated", route: "/curated", position: { "x": 2960, "y": 1820 } },
    scr_e1xixj: { name: "Categories", route: "/categories", position: { "x": 4360, "y": 1820 } },
    scr_jj7moi: { name: "Story Detail", route: "/story/h1", position: { "x": 160, "y": 3800 } }
  },
  sections: {
    sec_x86eqs: { name: "Browse & Discover", x: 0, y: 1600, width: 5720, height: 1180 },
    sec_21ekhe: { name: "Story", x: 0, y: 3580, width: 1520, height: 1180 }
  },
  layers: [
  { kind: "screen", id: "scr_vilzzb" },
  { kind: "screen", id: "scr_mn1p4z" },
  { kind: "section", id: "sec_x86eqs", children: [
    { kind: "screen", id: "scr_ij1n6u" },
    { kind: "screen", id: "scr_azjimz" },
    { kind: "screen", id: "scr_xapy4c" },
    { kind: "screen", id: "scr_e1xixj" }]
  },
  { kind: "section", id: "sec_21ekhe", children: [
    { kind: "screen", id: "scr_jj7moi" }]
  }]

};