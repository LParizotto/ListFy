import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { colors, fontSizes, fontWeights, radius, spacing } from "../../constants/theme"

const OPCOES = [
  { label: "Todos", value: "todos" },
  { label: "Ativos", value: "ativos" },
  { label: "Inativos", value: "inativos" },
]

export default function FilterTabs({ value, onChange }) {
  return (
    <View style={styles.container}>
      {OPCOES.map((item) => {
        const active = value === item.value

        return (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.button,
              active && styles.buttonActive,
            ]}
            onPress={() => onChange(item.value)}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.text,
                active && styles.textActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.white,
  },

  buttonActive: {
    backgroundColor: colors.primary,
  },

  text: {
    fontSize: fontSizes.small,
    color: colors.textMuted,
    fontWeight: fontWeights.medium,
  },

  textActive: {
    color: colors.white,
  },
})