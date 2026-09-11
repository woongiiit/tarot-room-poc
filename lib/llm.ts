// Korean card names and their metaphors
export const CARD_TYPES = [
  '안전기지',
  '도화선',
  '거울',
  '배터리',
  '네비',
  '방패',
  '개그담당',
  '솔직봇',
  '거리두기',
  '썸온도',
  '멘토',
  '라이벌',
] as const;

export type CardType = typeof CARD_TYPES[number];

// Deterministic Korean templates for each card (fallback when no LLM keys)
const CARD_TEMPLATES: Record<CardType, { hook: string; role: string; caption: string }> = {
  '안전기지': {
    hook: '당신은 누군가에게 편안한 쉼터입니다.',
    role: '힘들 때 돌아올 수 있는 곳, 안정감을 주는 존재입니다. 그 사람이 세상과 맞서기 전 충전하는 베이스캠프 같은 역할을 하고 있어요.',
    caption: '당신이 있어 그 사람은 다시 일어섭니다',
  },
  '도화선': {
    hook: '당신은 그 사람의 변화를 촉발하는 불꽃입니다.',
    role: '잠들어 있던 에너지를 깨우는 존재예요. 당신의 등장으로 그 사람의 일상에 새로운 움직임이 시작됩니다.',
    caption: '당신이 던진 작은 불씨가 큰 변화를 만듭니다',
  },
  '거울': {
    hook: '당신은 그 사람의 진짜 모습을 비춰주는 거울입니다.',
    role: '자신을 객관적으로 볼 수 있게 해주는 역할이에요. 당신을 통해 그 사람은 자신의 강점과 약점을 더 잘 이해합니다.',
    caption: '당신 앞에서 그 사람은 자신을 발견합니다',
  },
  '배터리': {
    hook: '당신은 그 사람에게 에너지를 충전해주는 배터리입니다.',
    role: '만나면 활력이 생기고 의욕이 샘솟게 하는 존재예요. 지칠 때 당신과의 시간이 그 사람을 다시 움직이게 합니다.',
    caption: '당신과 함께하면 그 사람은 충전됩니다',
  },
  '네비': {
    hook: '당신은 길을 잃은 그 사람의 내비게이션입니다.',
    role: '혼란스러울 때 방향을 제시하는 가이드 역할이에요. 당신의 조언과 경험이 그 사람의 선택에 길잡이가 됩니다.',
    caption: '당신의 안내로 그 사람은 길을 찾아갑니다',
  },
  '방패': {
    hook: '당신은 그 사람을 지켜주는 든든한 방패입니다.',
    role: '상처받지 않도록 보호하고 지지하는 존재예요. 당신이 곁에 있다는 것만으로도 그 사람은 안심합니다.',
    caption: '당신이 있어 그 사람은 두렵지 않습니다',
  },
  '개그담당': {
    hook: '당신은 그 사람의 일상에 웃음을 선물하는 존재입니다.',
    role: '무거운 분위기를 가볍게 만드는 역할이에요. 당신의 유머와 밝은 에너지가 그 사람의 하루를 즐겁게 만듭니다.',
    caption: '당신 덕분에 그 사람의 하루는 밝아집니다',
  },
  '솔직봇': {
    hook: '당신은 그 사람에게 진실을 말하는 정직한 존재입니다.',
    role: '듣기 좋은 말보다 필요한 진실을 전하는 역할이에요. 때론 아프지만 당신의 솔직함이 그 사람을 성장시킵니다.',
    caption: '당신의 직설이 그 사람을 깨웁니다',
  },
  '거리두기': {
    hook: '당신은 적절한 거리를 유지하는 균형 잡힌 존재입니다.',
    role: '가깝지만 너무 가깝지 않은 관계를 만드는 역할이에요. 당신의 거리감이 그 사람에게 편안함과 자유를 줍니다.',
    caption: '당신과의 거리가 그 사람에게 딱 맞습니다',
  },
  '썸온도': {
    hook: '당신은 그 사람에게 미묘한 설렘을 주는 존재입니다.',
    role: '확실하진 않지만 특별한 감정을 느끼게 하는 역할이에요. 당신과의 관계가 어떻게 될지 그 사람은 궁금해합니다.',
    caption: '당신 때문에 그 사람의 마음이 움직입니다',
  },
  '멘토': {
    hook: '당신은 그 사람의 성장을 이끄는 멘토입니다.',
    role: '경험과 지혜를 나누며 발전을 돕는 역할이에요. 당신의 가르침과 격려가 그 사람을 더 나은 사람으로 만듭니다.',
    caption: '당신의 지도로 그 사람은 성장합니다',
  },
  '라이벌': {
    hook: '당신은 그 사람에게 선의의 경쟁자입니다.',
    role: '함께 경쟁하며 서로를 자극하는 존재예요. 당신의 존재가 그 사람에게 더 노력하게 만드는 동기가 됩니다.',
    caption: '당신과의 경쟁이 그 사람을 강하게 만듭니다',
  },
};

const SYSTEM_PROMPT = `당신은 관계 역할 메타포 전문가입니다. 
주어진 카드는 관계에서의 역할을 나타내는 메타포입니다.
반드시 2인칭("당신은...")으로 작성하세요.

출력 형식:
1. 훅(hook): 한 문장으로 카드의 핵심을 전달하는 임팩트 있는 문장
2. 역할(role): 그 사람과의 관계에서 당신의 위치와 역할을 2문장으로 설명
3. 캡션(caption): 한 문장으로 관계의 의미를 요약

금지사항:
- 운세나 미래 예언 금지
- 비하하거나 부정적인 표현 금지
- 실명 추정 금지
- 1인칭 사용 금지 (반드시 2인칭 사용)

카드명을 그대로 반복하지 말고, 그 메타포가 담은 관계의 의미를 풀어서 설명하세요.`;

async function generateWithHuggingFace(cardType: CardType, question: string, nickname?: string): Promise<{ hook: string; role: string; caption: string } | null> {
  const token = process.env.HUGGINGFACE_TOKEN;
  if (!token) return null;

  const modelId = process.env.HF_MODEL_ID || 'meta-llama/Llama-3.3-70B-Instruct';
  
  try {
    const userMessage = `질문: "${question}"
선택한 카드: ${cardType}
${nickname ? `닉네임: ${nickname}` : ''}

위 카드가 의미하는 관계 역할을 해석해주세요.`;

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${modelId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${SYSTEM_PROMPT}\n\n${userMessage}`,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.8,
            top_p: 0.9,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('HuggingFace API error:', response.status);
      return null;
    }

    const data = await response.json();
    const text = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
    
    if (!text) return null;

    // Parse the response - simple heuristic parsing
    const lines = text.split('\n').filter((l: string) => l.trim());
    if (lines.length >= 3) {
      return {
        hook: lines[0].replace(/^훅:|^1\.|^\d+\./, '').trim(),
        role: lines.slice(1, -1).join(' ').replace(/^역할:|^2\.|^\d+\./, '').trim(),
        caption: lines[lines.length - 1].replace(/^캡션:|^3\.|^\d+\./, '').trim(),
      };
    }

    return null;
  } catch (error) {
    console.error('HuggingFace generation error:', error);
    return null;
  }
}

async function generateWithOpenAI(cardType: CardType, question: string, nickname?: string): Promise<{ hook: string; role: string; caption: string } | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  try {
    const userMessage = `질문: "${question}"
선택한 카드: ${cardType}
${nickname ? `닉네임: ${nickname}` : ''}

위 카드가 의미하는 관계 역할을 해석해주세요.`;

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.8,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status);
      return null;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    
    if (!text) return null;

    // Parse the response
    const lines = text.split('\n').filter((l: string) => l.trim());
    if (lines.length >= 3) {
      return {
        hook: lines[0].replace(/^훅:|^1\.|^\d+\./, '').trim(),
        role: lines.slice(1, -1).join(' ').replace(/^역할:|^2\.|^\d+\./, '').trim(),
        caption: lines[lines.length - 1].replace(/^캡션:|^3\.|^\d+\./, '').trim(),
      };
    }

    return null;
  } catch (error) {
    console.error('OpenAI generation error:', error);
    return null;
  }
}

export async function generateReading(
  cardType: CardType,
  question: string,
  nickname?: string
): Promise<{ hook: string; role: string; caption: string }> {
  // Try HuggingFace first
  const hfResult = await generateWithHuggingFace(cardType, question, nickname);
  if (hfResult) return hfResult;

  // Fallback to OpenAI
  const openaiResult = await generateWithOpenAI(cardType, question, nickname);
  if (openaiResult) return openaiResult;

  // Final fallback to deterministic templates
  return CARD_TEMPLATES[cardType];
}
