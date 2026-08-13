const configuredSnapshotUrl = import.meta.env.VITE_AI_SNAPSHOT_CTA_URL?.trim();

export const publicEnv = {
  snapshotCtaUrl: configuredSnapshotUrl || '/contact#snapshot-enquiry',
  snapshotCheckoutApproved: Boolean(configuredSnapshotUrl),
} as const;
