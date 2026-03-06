import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Google Generative AI module
const mockGenerateContent = vi.fn();
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return { generateContent: mockGenerateContent };
      }
    },
  };
});

// Import after mocking
const { POST } = await import('../route');

function makeRequest(body: object): Request {
  return new Request('http://localhost/api/tag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/tag', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset();
  });

  it('returns 400 when text is missing', async () => {
    const req = makeRequest({});
    const res = await POST(req as any);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe('Missing text');
  });

  it('returns valid stance and rhetoric tags', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => '{"stance": "for", "rhetoric": "evidence"}',
      },
    });

    const req = makeRequest({
      text: 'Historical records show that trade increased',
      centralQuestion: 'Was Roman trade beneficial?',
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.stance).toBe('for');
    expect(json.rhetoric).toBe('evidence');
  });

  it('strips markdown wrapping from AI response', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => '```json\n{"stance": "against", "rhetoric": "values"}\n```',
      },
    });

    const req = makeRequest({ text: 'This is morally wrong' });
    const res = await POST(req as any);
    const json = await res.json();

    expect(json.stance).toBe('against');
    expect(json.rhetoric).toBe('values');
  });

  it('returns null for invalid stance/rhetoric values', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => '{"stance": "none", "rhetoric": "none"}',
      },
    });

    const req = makeRequest({ text: 'Hello everyone, welcome.' });
    const res = await POST(req as any);
    const json = await res.json();

    expect(json.stance).toBeNull();
    expect(json.rhetoric).toBeNull();
  });

  it('validates all accepted stance values', async () => {
    for (const stance of ['for', 'against', 'mixed']) {
      mockGenerateContent.mockResolvedValueOnce({
        response: {
          text: () => JSON.stringify({ stance, rhetoric: 'evidence' }),
        },
      });

      const req = makeRequest({ text: 'test argument' });
      const res = await POST(req as any);
      const json = await res.json();
      expect(json.stance).toBe(stance);
    }
  });

  it('validates all accepted rhetoric values', async () => {
    for (const rhetoric of ['evidence', 'values', 'consequences', 'authority']) {
      mockGenerateContent.mockResolvedValueOnce({
        response: {
          text: () => JSON.stringify({ stance: 'for', rhetoric }),
        },
      });

      const req = makeRequest({ text: 'test argument' });
      const res = await POST(req as any);
      const json = await res.json();
      expect(json.rhetoric).toBe(rhetoric);
    }
  });

  it('returns 200 with nulls on API failure (silent degradation)', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('API rate limit'));

    const req = makeRequest({ text: 'some argument' });
    const res = await POST(req as any);

    // Current behavior: returns 200 even on error
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.stance).toBeNull();
    expect(json.rhetoric).toBeNull();
  });
});
