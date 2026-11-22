import { Pressable, Text, View } from 'react-native';

/** Brand metadata for a Nigerian mobile network. `code` is what the backend expects (lowercase). */
export interface NetworkBrand {
  code: string;
  label: string;
  color: string;
  textColor: string;
  shortName: string;
}

export const NETWORK_BRANDS: NetworkBrand[] = [
  { code: 'mtn', label: 'MTN', color: '#FFCC00', textColor: '#1A1A1A', shortName: 'MTN' },
  { code: 'airtel', label: 'Airtel', color: '#E40000', textColor: '#FFFFFF', shortName: 'AIR' },
  { code: 'glo', label: 'Glo', color: '#009639', textColor: '#FFFFFF', shortName: 'GLO' },
  { code: '9mobile', label: '9mobile', color: '#006F45', textColor: '#FFFFFF', shortName: '9M' },
];

/** Compact colored badge standing in for a network logo without shipping trademarked assets. */
export function NetworkLogo({ brand, size = 40 }: { brand: NetworkBrand; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        backgroundColor: brand.color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: brand.textColor, fontWeight: '800', fontSize: size * 0.3, letterSpacing: -0.5 }}>
        {brand.shortName}
      </Text>
    </View>
  );
}

/** Row of selectable network tiles (logo + label), shared by the airtime and data screens. */
export function NetworkSelector({
  selected,
  onSelected,
  brands = NETWORK_BRANDS,
}: {
  selected: string;
  onSelected: (code: string) => void;
  brands?: NetworkBrand[];
}) {
  return (
    <View className="flex-row">
      {brands.map((brand) => {
        const isSelected = brand.code === selected;
        return (
          <View key={brand.code} className="flex-1 px-1">
            <Pressable
              onPress={() => onSelected(brand.code)}
              className={`items-center rounded-2xl bg-white px-1 py-3 ${
                isSelected ? 'border-2 border-primary-500 bg-primary-500/10' : 'border border-line'
              }`}
            >
              <NetworkLogo brand={brand} size={36} />
              <Text
                numberOfLines={1}
                className={`mt-2 text-xs ${
                  isSelected ? 'font-bold text-primary-600' : 'font-medium text-ink-secondary'
                }`}
              >
                {brand.label}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
