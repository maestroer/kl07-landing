/**
 * Кладёт текст в буфер обмена.
 * Возвращает false, если не вышло — буфер недоступен на http-origin, в старых
 * браузерах и при отозванном разрешении. Вызывающий обязан показать это
 * пользователю: молча ничего не делать нельзя, человек копирует адрес кошелька
 * или почту и должен понимать, лежит оно в буфере или нет.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Clipboard API отклоняется на http-origin, без фокуса окна и под
    // ограничивающей permissions policy (например, внутри iframe).
  }
  return legacyCopy(text)
}

/**
 * Запасной путь через execCommand. Формально устаревший, но работает там,
 * где Clipboard API закрыт, и поддерживается всеми живыми браузерами.
 */
function legacyCopy(text: string): boolean {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;'
  document.body.appendChild(ta)
  ta.select()
  ta.setSelectionRange(0, text.length)
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  document.body.removeChild(ta)
  return ok
}

/** Выделяет содержимое узла, чтобы человек мог скопировать сам через ctrl+c. */
export function selectNode(id: string) {
  const node = document.getElementById(id)
  if (!node) return
  const range = document.createRange()
  range.selectNodeContents(node)
  const sel = window.getSelection()
  sel?.removeAllRanges()
  sel?.addRange(range)
}
