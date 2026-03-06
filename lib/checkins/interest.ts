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
