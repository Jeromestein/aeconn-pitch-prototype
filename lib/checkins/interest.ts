const CANONICAL_INTEREST_VALUES = new Set([
  "insurance",
  "investment",
  "loan",
  "other",
])

export function normalizeInterestValue(value?: string | null) {
  const normalized = value?.trim().toLowerCase()
  if (!normalized) {
    return null
  }

  return CANONICAL_INTEREST_VALUES.has(normalized) ? normalized : null
}

export function getInterestTranslationKey(value?: string | null) {
  switch (normalizeInterestValue(value)) {
    case "insurance":
      return "interestDesign"
    case "investment":
      return "interestProduct"
    case "loan":
      return "interestPartner"
    case "other":
      return "interestOther"
    default:
      return null
  }
}
