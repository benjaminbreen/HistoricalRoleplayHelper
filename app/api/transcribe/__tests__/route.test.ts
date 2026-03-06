import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally before importing route
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const { POST } = await import('../route');

/** Create a mock NextRequest with a pre-built formData result */
function mockReq(fields: Record<string, string | File | null>): any {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) {
    if (v !== null) fd.append(k, v);
  }
  return { formData: async () => fd };
}

function fakeAudio(size: number = 5000): File {
  const blob = new Blob([new Uint8Array(Math.min(size, 100))], { type: 'audio/webm' });
  const file = new File([blob], 'audio.webm', { type: 'audio/webm' });
  if (size !== blob.size) {
    Object.defineProperty(file, 'size', { value: size });
  }
  return file;
}

describe('POST /api/transcribe', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns 400 when no audio file is provided', async () => {
    const req = mockReq({});
    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe('Missing audio file');
  });

  it('returns 400 when audio file exceeds 25MB', async () => {
    const req = mockReq({ audio: fakeAudio(26 * 1024 * 1024) });
    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain('too large');
  });

  it('forwards audio to Whisper API and returns transcription', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'Hello world' }),
    });

    const req = mockReq({ audio: fakeAudio() });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.text).toBe('Hello world');

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.openai.com/v1/audio/transcriptions');
  });

  it('passes prompt field to Whisper API when provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'Constantius spoke' }),
    });

    const req = mockReq({
      audio: fakeAudio(),
      prompt: 'Constantius, the Roman Envoy',
    });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const [, options] = mockFetch.mock.calls[0];
    const sentForm = options.body as FormData;
    expect(sentForm.get('prompt')).toBe('Constantius, the Roman Envoy');
  });

  it('does not include prompt field when not provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'Hello' }),
    });

    const req = mockReq({ audio: fakeAudio() });
    await POST(req);

    const [, options] = mockFetch.mock.calls[0];
    const sentForm = options.body as FormData;
    expect(sentForm.get('prompt')).toBeNull();
  });

  it('returns 500 when Whisper API fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Unauthorized',
    });

    const req = mockReq({ audio: fakeAudio() });
    const res = await POST(req);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe('Transcription failed');
  });
});
