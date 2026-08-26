export const site = {
  tg: '@mercydetka',
  tgUrl: 'https://t.me/mercydetka',
  email: 'kl07business@gmail.com',
  /**
   * Куда уходит заявка из вейтлиста.
   * Задаётся через .env: VITE_WAITLIST_ENDPOINT=https://formspree.io/f/xxxxx
   * Если не задан — форма падает в mailto-фолбэк и всё равно доводит лид.
   */
  waitlistEndpoint: (import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined) || '',
  onepager: `${import.meta.env.BASE_URL}KL07_OnePager.pdf`,
  deck: `${import.meta.env.BASE_URL}KL07_Presentation.pdf`,
}

export type Wallet = {
  /** тикер монеты: BTC, USDT, TON… */
  ticker: string
  /** сеть: bitcoin, erc-20, trc-20, ton… */
  network: string
  /** адрес кошелька. Пусто = в окне покажется «скоро» вместо адреса. */
  address: string
}

/**
 * Крипто-кошельки проекта для окна донатов.
 * Впишите адреса сюда — окно подхватит их само, больше нигде править не нужно.
 */
export const wallets: Wallet[] = [
  { ticker: 'BTC', network: 'bitcoin', address: 'bc1qnnnepmhu3yfe24ccgnm82ppy0ga3vj9qxz559t' },
  { ticker: 'USDT', network: 'trc-20', address: 'TLAB5PAT2ksK8eixRmefRxcdZ5DmPV6FjT' },
  { ticker: 'SOL', network: 'solana', address: 'Hvrc9QikDxRLZNogHjcKCFUHRx8HCvXd3JB8dSrR7ZYK' },
]
