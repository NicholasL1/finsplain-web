import type { AnalyzeResponse, APIErrorResponse } from "@/src/types/api"
import { isUserFacingError } from "@/src/types/api"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

export class AnalyzeError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly userFacing: boolean
  ) {
    super(message)
    this.name = "AnalyzeError"
  }
}

/**
 * Calls POST /api/v1/analyze on the backend with the uploaded file.
 * Returns the full AnalyzeResponse on success or partial success.
 * Throws AnalyzeError on HTTP-level errors.
 */
export async function analyzeDocument(
  file: File,
  accessToken: string
): Promise<AnalyzeResponse> {
  const formData = new FormData()
  formData.append("documents", file)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 300_000) // 5 minutes

  let res: Response
  try {
    res = await fetch(`${BACKEND_URL}/api/v1/analyze`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeoutId)
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new AnalyzeError(
        "The analysis is taking longer than expected. Please try again with a smaller document.",
        "TIMEOUT",
        true
      )
    }
    throw err
  }
  clearTimeout(timeoutId)

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as APIErrorResponse | null
    const code = body?.error?.code || "INTERNAL_ERROR"
    const message = body?.error?.message || "Something went wrong on our end. Please try again."
    throw new AnalyzeError(
      isUserFacingError(code) ? message : "Something went wrong on our end. Please try again.",
      code,
      isUserFacingError(code)
    )
  }

  return (await res.json()) as AnalyzeResponse
}
