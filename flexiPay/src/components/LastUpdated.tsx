import { Text } from 'react-native';

import { dashboardStore } from '@/lib/dashboardStore';
import { formatDateTime } from '@/lib/format';

export function LastUpdated() {
  const { savedAt, fromCache } = dashboardStore.useDashboard();
  if (!savedAt) return null;

  return (
    <Text className={`px-4 pb-2 text-xs ${fromCache ? 'font-medium text-warning' : 'text-ink-muted'}`}>
      {fromCache ? 'Saved data · ' : 'Updated '}
      {formatDateTime(new Date(savedAt))}
    </Text>
  );
}