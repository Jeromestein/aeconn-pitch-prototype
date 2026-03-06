const CANONICAL_INTEREST_VALUES = new Set([
  "insurance",
  "investment",
  "agent",
  "other",
])

export function normalizeInterestValue(value?: string | null) {
  const normalized = value?.trim().toLowerCase()
  if (!normalized) {
    return null
  }

  if (normalized === "loan") {
    return "agent"
  }

  if (normalized === "insurance" || normalized === "保险") {
    return "insurance"
  }

  if (normalized === "investment" || normalized === "投资") {
    return "investment"
  }

  if (normalized === "agent" || normalized === "副业") {
    return "agent"
  }

  if (normalized === "other" || normalized === "其他") {
    return "other"
  }

  return CANONICAL_INTEREST_VALUES.has(normalized) ? normalized : null
}

export function getInterestTranslationKey(value?: string | null) {
  switch (normalizeInterestValue(value)) {
    case "insurance":
      return "interestDesign"
    case "investment":
      return "interestProduct"
    case "agent":
      return "interestPartner"
    case "other":
      return "interestOther"
    default:
      return null
  }
}
