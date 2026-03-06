function escapeCsvValue(value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined) {
    return ""
  }

  const stringValue = String(value)

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

export function buildCsvContent(
  headers: string[],
  rows: Array<Array<string | number | boolean | null | undefined>>
) {
  const lines = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ]

  return `\uFEFF${lines.join("\r\n")}`
}

export function downloadCsvFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = filename
  link.style.display = "none"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function parseCsvContent(content: string) {
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentValue = ""
  let inQuotes = false

  const normalized = content.replace(/^\uFEFF/, "")

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index]
    const nextChar = normalized[index + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentValue += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (!inQuotes && char === ",") {
      currentRow.push(currentValue)
      currentValue = ""
      continue
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && nextChar === "\n") {
        index += 1
      }

      currentRow.push(currentValue)
      rows.push(currentRow)
      currentRow = []
      currentValue = ""
      continue
    }

    currentValue += char
  }

  if (currentValue.length > 0 || currentRow.length > 0) {
    currentRow.push(currentValue)
    rows.push(currentRow)
  }

  return rows.filter((row) => row.some((cell) => cell.trim().length > 0))
}
