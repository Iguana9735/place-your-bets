import type { UnixMillis } from '../model/model.ts'

const moneyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

const instantFormatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
})

const formatMoney = (money: number) => {
    return moneyFormatter.format(money)
}

const formatInstant = (unixMillis: UnixMillis) => {
    return instantFormatter.format(unixMillis)
}

export { formatInstant, formatMoney }