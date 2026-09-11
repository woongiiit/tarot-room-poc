import { generateRoleLine } from './cards';

export async function generateTextWithHF(
  cardKey: string,
  question: string
): Promise<string> {
  const hfToken = process.env.HUGGINGFACE_TOKEN;
  const modelId = process.env.HF_MODEL_ID || 'meta-llama/Llama-3.2-3B-Instruct';

  // Fallback to template if no HF token
  if (!hfToken) {
    return generateRoleLine(cardKey, question);
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${modelId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `다음 질문에 대해 "${cardKey}" 역할로 한국어로 2인칭 관점에서 짧은 관계 설명을 작성해주세요: "${question}"`,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('HuggingFace API error:', response.status);
      return generateRoleLine(cardKey, question);
    }

    const result = await response.json();
    
    if (Array.isArray(result) && result[0]?.generated_text) {
      return result[0].generated_text;
    }
    
    // Fallback to template if response format is unexpected
    return generateRoleLine(cardKey, question);
  } catch (error) {
    console.error('Error calling HuggingFace API:', error);
    return generateRoleLine(cardKey, question);
  }
}
