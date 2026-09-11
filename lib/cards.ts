export interface Card {
  key: string;
  name: string;
  template: string;
}

export const CARDS: Card[] = [
  {
    key: "safe-base",
    name: "안전기지",
    template: "당신은 {question}에서 나에게 안전한 피난처가 되어줍니다. 당신 곁에 있으면 모든 불안이 사라지고 편안함을 느낍니다."
  },
  {
    key: "catalyst",
    name: "도화선",
    template: "당신은 {question}에서 나의 변화를 촉발하는 존재입니다. 당신을 만나면서 내 안에 잠들어 있던 열정과 가능성이 깨어납니다."
  },
  {
    key: "mirror",
    name: "거울",
    template: "당신은 {question}에서 나를 비추는 거울입니다. 당신을 통해 진짜 내 모습을 발견하고, 숨겨왔던 감정을 마주하게 됩니다."
  },
  {
    key: "battery",
    name: "배터리",
    template: "당신은 {question}에서 나에게 에너지를 충전해주는 존재입니다. 당신과 함께 있으면 활력이 넘치고 무엇이든 할 수 있을 것 같습니다."
  },
  {
    key: "navigator",
    name: "네비",
    template: "당신은 {question}에서 나의 길잡이가 되어줍니다. 헤매고 있을 때 당신의 조언이 명확한 방향을 제시해줍니다."
  },
  {
    key: "shield",
    name: "방패",
    template: "당신은 {question}에서 나를 지켜주는 방패입니다. 어려운 상황에서 당신이 나를 보호하고 든든한 버팀목이 되어줍니다."
  },
  {
    key: "comedian",
    name: "개그담당",
    template: "당신은 {question}에서 나를 웃게 만드는 존재입니다. 무거운 순간에도 당신의 유머가 분위기를 밝게 바꿔줍니다."
  },
  {
    key: "honesty-bot",
    name: "솔직봇",
    template: "당신은 {question}에서 나에게 진실을 말해주는 존재입니다. 듣기 힘든 말이라도 당신의 솔직함이 결국 나를 성장시킵니다."
  },
  {
    key: "distance",
    name: "거리두기",
    template: "당신은 {question}에서 나에게 적절한 거리를 유지하게 합니다. 그 거리 덕분에 각자의 공간을 존중하며 건강한 관계를 유지합니다."
  },
  {
    key: "temperature",
    name: "썸온도",
    template: "당신은 {question}에서 묘한 설렘을 주는 존재입니다. 확실하지 않은 사이의 긴장감이 매 순간을 두근거리게 만듭니다."
  },
  {
    key: "mentor",
    name: "멘토",
    template: "당신은 {question}에서 나의 스승이 됩니다. 당신의 경험과 지혜가 내가 더 나은 사람이 되도록 이끌어줍니다."
  },
  {
    key: "rival",
    name: "라이벌",
    template: "당신은 {question}에서 나의 라이벌입니다. 당신과의 경쟁이 나를 더 강하게 만들고 최선을 다하게 합니다."
  }
];

export function getRandomCard(): Card {
  const randomIndex = Math.floor(Math.random() * CARDS.length);
  return CARDS[randomIndex];
}

export function getCardByKey(key: string): Card | undefined {
  return CARDS.find(card => card.key === key);
}

export function generateRoleLine(cardKey: string, question: string): string {
  const card = getCardByKey(cardKey);
  if (!card) return "";
  return card.template.replace("{question}", question);
}
