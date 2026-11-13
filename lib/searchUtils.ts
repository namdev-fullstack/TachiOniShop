// lib/searchUtils.ts
// Tiện ích tìm kiếm thông minh cho Shop Acc Liên Quân

/**
 * Bỏ dấu tiếng Việt, chuyển chữ thường và xóa ký tự dư thừa
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

/**
 * Danh sách viết tắt phổ biến của game thủ Liên Quân
 */
export const HERO_ALIASES: Record<string, string[]> = {
  nak: ["nak", "nakroth", "loi quang su", "ve than", "bboy", "sieu viet", "quang su"],
  nakroth: ["nakroth", "nak", "loi quang su", "ve than"],
  flo: ["flo", "florentino", "tinh he", "vu kiem su", "bay mau", "than thoai", "tuyet sac"],
  florentino: ["florentino", "flo", "tinh he", "vu kiem su", "bay mau", "than thoai", "tuyet sac"],
  enzo: ["enzo", "trang khuyet", "hong hac", "sat thu bi ngo"],
  raz: ["raz", "muay thai", "tin tac", "bang quyen"],
  tulen: ["tulen", "kiem tien", "tan nien", "tien hac", "chi ton"],
  lau: ["lau", "lauriel", "ve than", "tinh van su", "tuyet sac"],
  lauriel: ["lauriel", "lau", "ve than", "tinh van su", "tuyet sac"],
  airi: ["airi", "bich hai", "bach kishin", "kiem bach"],
  val: ["val", "valhein", "xa than", "hoang tu bang"],
  valhein: ["valhein", "val", "xa than"],
  khi: ["khi", "ngo khong", "wukong", "nhoc ti ba dao", "sieu viet"],
  wukong: ["wukong", "ngo khong", "khi", "nhoc ti ba dao"],
  zuka: ["zuka", "dau bep", "gau tuyet", "phat tai"],
  ryoma: ["ryoma", "samurai", "da than bento"],
  vio: ["vio", "violet", "ve than", "phao hoa"],
  violet: ["violet", "vio", "ve than", "phao hoa"],
  butter: ["butter", "butterfly", "nu quai", "kim dong phuc"],
  murad: ["murad", "chi ton than kiem", "sieu viet"],
  haya: ["haya", "hayate", "kim ma su vuong"],
  hayate: ["hayate", "haya", "kim ma su vuong"],
  paine: ["paine", "pain"],
  pain: ["pain", "paine"],
  allain: ["allain", "tuyet son"],
  // Tướng & Skin Hot
  tachi: ["tachi", "benimaru", "tachi benimaru"],
  benimaru: ["benimaru", "tachi", "tachi benimaru"],
  "tachi benimaru": ["tachi benimaru", "tachi", "benimaru"],
  "bolt baron": ["bolt baron", "bolt", "baron"],
  bolt: ["bolt", "bolt baron"],
  baron: ["baron", "bolt baron"],
  "bach dien": ["bach dien", "nakroth bach dien", "nakroth", "nak"],
  "nakroth bach dien": ["nakroth bach dien", "bach dien", "nakroth", "nak"],
  kid: ["kid", "hayate kid", "hayate", "haya"],
  "hayate kid": ["hayate kid", "kid", "hayate", "haya"],
  "ngo khong": ["ngo khong", "ngokhong", "khi", "wukong", "nhoc ti ba dao", "sieu viet"],
  ngokhong: ["ngo khong", "ngokhong", "khi", "wukong"],
  ngo: ["ngo khong", "ngokhong", "khi", "wukong"],
  // Skin phổ biến
  "ve than": ["ve than", "thu nguyen ve than", "tnvt"],
  "thu nguyen": ["thu nguyen ve than", "ve than"],
  "muay thai": ["muay thai", "raz"],
  "tinh he": ["tinh he", "flo", "florentino"],
  "kiem tien": ["kiem tien", "tulen"],
  "tuyet sac": ["tuyet sac"],
  "sieu viet": ["sieu viet"],
};

export interface SearchableItem {
  code?: string;
  title?: string;
  highlight?: string;
}

/**
 * Tìm kiếm gần đúng dựa trên ID (mã acc) và Title bằng 1 input duy nhất
 */
export function matchAccountFuzzy(item: SearchableItem, query: string): boolean {
  const rawQuery = (query || "").trim();
  if (!rawQuery) return true;

  const cleanQuery = removeVietnameseTones(rawQuery);
  if (!cleanQuery) return true;

  // 1. Kiểm tra khớp mã ID acc (ví dụ khách gõ "10245", "#10245", hoặc vài số cuối)
  const queryWithoutHash = cleanQuery.replace(/^#/, "");
  const codeRaw = (item.code || "").toLowerCase();
  const codeWithoutHash = codeRaw.replace(/^#/, "");

  if (
    codeRaw.includes(cleanQuery) ||
    codeWithoutHash.includes(queryWithoutHash)
  ) {
    return true;
  }

  // 2. Kiểm tra khớp Title / Highlight gần đúng
  const rawTitle = `${item.title || ""} ${item.highlight || ""}`.trim();
  const normTitle = removeVietnameseTones(rawTitle);

  // Nếu chuỗi tìm kiếm nằm trong Title
  if (normTitle.includes(cleanQuery)) {
    return true;
  }

  // Tách từng từ khoá và kiểm tra với alias (vd gõ "nak flo" -> tìm thấy nếu title có nakroth & florentino)
  const tokens = cleanQuery.split(/\s+/).filter(Boolean);
  const allTokensMatch = tokens.every((token) => {
    // Trực tiếp chứa token
    if (normTitle.includes(token)) return true;

    // Chứa alias của token (vd "nak" -> "nakroth", "flo" -> "florentino")
    const aliases = HERO_ALIASES[token];
    if (aliases && aliases.some((a) => normTitle.includes(removeVietnameseTones(a)))) {
      return true;
    }

    return false;
  });

  if (allTokensMatch) {
    return true;
  }

  // Kiểm tra cả cụm từ alias nếu có (vd "muay thai", "ve than")
  const phraseAliases = HERO_ALIASES[cleanQuery];
  if (phraseAliases && phraseAliases.some((a) => normTitle.includes(removeVietnameseTones(a)))) {
    return true;
  }

  return false;
}
