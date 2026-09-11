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
    hook: '너는 나한테 편안한 쉼터야.',
    role: '힘들 때 돌아올 수 있는 곳, 안정감을 주는 존재야. 내가 세상과 맞서기 전 충전하는 베이스캠프 같은 역할을 하고 있어.',
    caption: '너 덕분에 나는 다시 일어서',
  },
  '도화선': {
    hook: '너는 나한테 변화를 촉발하는 불꽃이야.',
    role: '잠들어 있던 에너지를 깨우는 존재야. 네가 나타나면서 내 일상에 새로운 움직임이 시작됐어.',
    caption: '네가 던진 작은 불씨가 내 안에서 큰 변화를 만들어',
  },
  '거울': {
    hook: '너는 나한테 진짜 모습을 비춰주는 거울이야.',
    role: '나를 객관적으로 볼 수 있게 해주는 역할이야. 너를 통해 내 강점과 약점을 더 잘 이해하게 돼.',
    caption: '너 앞에서 나는 나를 발견해',
  },
  '배터리': {
    hook: '너는 나한테 에너지를 충전해주는 배터리야.',
    role: '만나면 활력이 생기고 의욕이 샘솟게 하는 존재야. 지칠 때 너와의 시간이 나를 다시 움직이게 해.',
    caption: '너와 함께하면 나는 충전돼',
  },
  '네비': {
    hook: '너는 나한테 길을 알려주는 내비게이션이야.',
    role: '혼란스러울 때 방향을 제시하는 가이드 역할이야. 네 조언과 경험이 내 선택에 길잡이가 돼.',
    caption: '네 안내로 나는 길을 찾아가',
  },
  '방패': {
    hook: '너는 나한테 든든한 방패야.',
    role: '상처받지 않도록 보호하고 지지하는 존재야. 네가 곁에 있다는 것만으로도 나는 안심이 돼.',
    caption: '너 덕분에 나는 두렵지 않아',
  },
  '개그담당': {
    hook: '너는 나한테 웃음을 선물하는 존재야.',
    role: '무거운 분위기를 가볍게 만드는 역할이야. 네 유머와 밝은 에너지가 내 하루를 즐겁게 만들어.',
    caption: '너 덕분에 내 하루는 밝아져',
  },
  '솔직봇': {
    hook: '너는 나한테 진실을 말하는 정직한 존재야.',
    role: '듣기 좋은 말보다 필요한 진실을 전하는 역할이야. 때론 아프지만 네 솔직함이 나를 성장시켜.',
    caption: '네 직설이 나를 깨워',
  },
  '거리두기': {
    hook: '너는 나한테 적절한 거리를 유지하는 균형 잡힌 존재야.',
    role: '가깝지만 너무 가깝지 않은 관계를 만드는 역할이야. 네 거리감이 나한테 편안함과 자유를 줘.',
    caption: '너와의 거리가 나한테 딱 맞아',
  },
  '썸온도': {
    hook: '너는 나한테 미묘한 설렘을 주는 존재야.',
    role: '확실하진 않지만 특별한 감정을 느끼게 하는 역할이야. 너와의 관계가 어떻게 될지 나는 궁금해.',
    caption: '너 때문에 내 마음이 움직여',
  },
  '멘토': {
    hook: '너는 나한테 성장을 이끄는 멘토야.',
    role: '경험과 지혜를 나누며 발전을 돕는 역할이야. 네 가르침과 격려가 나를 더 나은 사람으로 만들어.',
    caption: '네 지도로 나는 성장해',
  },
  '라이벌': {
    hook: '너는 나한테 선의의 경쟁자야.',
    role: '함께 경쟁하며 서로를 자극하는 존재야. 네 존재가 나한테 더 노력하게 만드는 동기가 돼.',
    caption: '너와의 경쟁이 나를 강하게 만들어',
  },
};

const SYSTEM_PROMPT = `당신은 관계 역할 메타포 전문가입니다. 
주어진 카드는 관계에서의 역할을 나타내는 메타포입니다.
반드시 방 생성자(호스트)를 향한 2인칭("너는 나한테...")으로 작성하세요.

출력 형식:
1. 훅(hook): "너는 나한테 ○○야." 형식으로 카드의 핵심을 전달하는 임팩트 있는 문장
2. 역할(role): "너" / "나한테" 형식으로 관계에서의 위치와 역할을 2문장으로 설명
3. 캡션(caption): "너" 중심으로 한 문장 요약

금지사항:
- "당신은 그 사람에게", "그 사람은 당신에게" 같은 3인칭 관찰 표현 금지
- 운세, 사주, 미래 예언 표현 금지
- 비하하거나 부정적인 표현 금지
- 실명 추정 금지

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
