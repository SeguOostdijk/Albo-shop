const MEMBERSHIP_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

export function getMembershipExpiresAt(
	lastPaymentAt: string | null | undefined,
) {
	if (!lastPaymentAt) return null;

	const paidAt = new Date(lastPaymentAt);
	if (Number.isNaN(paidAt.getTime())) return null;

	return new Date(paidAt.getTime() + MEMBERSHIP_DAYS * DAY_MS);
}

export function getMembershipDaysRemaining(
	lastPaymentAt: string | null | undefined,
	now = new Date(),
) {
	const expiresAt = getMembershipExpiresAt(lastPaymentAt);
	if (!expiresAt) return 0;

	return Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / DAY_MS));
}

export function isMembershipCurrent(
	lastPaymentAt: string | null | undefined,
	now = new Date(),
) {
	return getMembershipDaysRemaining(lastPaymentAt, now) > 0;
}
