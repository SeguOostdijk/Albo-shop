export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateInstallments(price: number, installments: number = 3): string {
  const installmentAmount = Math.ceil(price / installments)
  return `${installments} cuotas sin interés de ${formatCurrency(installmentAmount)}`
}
