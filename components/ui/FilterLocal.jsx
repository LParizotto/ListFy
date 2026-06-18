import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useState } from "react"
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native"
import { colors, fontSizes, fontWeights, radius, shadows, spacing } from "../../constants/theme"

const OPCAO_TODOS = { idLocal: null, nome: "Todos os locais" }

export default function FilterLocal({ locais = [], value, onChange }) {
    const [aberto, setAberto] = useState(false)
    const localSelecionado = locais.find((l) => l.idLocal === value) ?? null
    const label = localSelecionado ? localSelecionado.nome : "Todos os locais"

    const handleSelect = (idLocal) => {
        onChange(idLocal)
        setAberto(false)
    }

    const opcoes = [OPCAO_TODOS, ...locais]

    return (
        <>
            <TouchableOpacity
                style={[styles.trigger, value !== null && styles.triggerAtivo]}
                onPress={() => setAberto(true)}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons
                    name="store-outline"
                    size={15}
                    color={value !== null ? colors.primary : colors.textMuted}
                />
                <Text
                    style={[styles.triggerTexto, value !== null && styles.triggerTextoAtivo]}
                    numberOfLines={1}
                >
                    {label}
                </Text>
                <MaterialCommunityIcons
                    name="chevron-down"
                    size={16}
                    color={value !== null ? colors.primary : colors.textMuted}
                />
            </TouchableOpacity>

            <Modal
                visible={aberto}
                transparent
                animationType="fade"
                onRequestClose={() => setAberto(false)}
            >
                <TouchableWithoutFeedback onPress={() => setAberto(false)}>
                    <View style={styles.overlay}>
                        <TouchableWithoutFeedback>
                            <View style={[styles.sheet, shadows.lg]}>

                                <View style={styles.sheetHeader}>
                                    <Text style={styles.sheetTitulo}>Filtrar por local</Text>
                                    <TouchableOpacity
                                        onPress={() => setAberto(false)}
                                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                    >
                                        <MaterialCommunityIcons
                                            name="close"
                                            size={20}
                                            color={colors.textMuted}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.divider} />

                                <FlatList
                                    data={opcoes}
                                    keyExtractor={(item) => String(item.idLocal ?? "todos")}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => {
                                        const selecionado = item.idLocal === value
                                        return (
                                            <TouchableOpacity
                                                style={[styles.opcao, selecionado && styles.opcaoSelecionada]}
                                                onPress={() => handleSelect(item.idLocal)}
                                                activeOpacity={0.7}
                                            >
                                                <MaterialCommunityIcons
                                                    name={item.idLocal === null ? "all-inclusive" : "store-outline"}
                                                    size={18}
                                                    color={selecionado ? colors.primary : colors.textMuted}
                                                />
                                                <Text
                                                    style={[
                                                        styles.opcaoTexto,
                                                        selecionado && styles.opcaoTextoSelecionado,
                                                    ]}
                                                    numberOfLines={1}
                                                >
                                                    {item.nome}
                                                </Text>
                                                {selecionado && (
                                                    <MaterialCommunityIcons
                                                        name="check"
                                                        size={18}
                                                        color={colors.primary}
                                                        style={styles.opcaoCheck}
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    )
}


const styles = StyleSheet.create({
    trigger: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs - 2,
        alignSelf: "flex-start",
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.full,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs - 2,
        maxWidth: 200,
    },
    triggerAtivo: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight,
    },
    triggerTexto: {
        flex: 1,
        fontSize: fontSizes.small,
        fontWeight: fontWeights.medium,
        color: colors.textMuted,
    },
    triggerTextoAtivo: {
        color: colors.primary,
    },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "flex-end",
    },

    sheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: radius.bottomSheet,
        borderTopRightRadius: radius.bottomSheet,
        paddingBottom: spacing.xl,
        maxHeight: "60%",
    },
    sheetHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    sheetTitulo: {
        fontSize: fontSizes.h3,
        fontWeight: fontWeights.semibold,
        color: colors.dark,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: spacing.xs,
    },

    opcao: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm + 2,
    },
    opcaoSelecionada: {
        backgroundColor: colors.primaryLight,
    },
    opcaoTexto: {
        flex: 1,
        fontSize: fontSizes.body,
        fontWeight: fontWeights.regular,
        color: colors.text,
    },
    opcaoTextoSelecionado: {
        fontWeight: fontWeights.semibold,
        color: colors.primary,
    },
    opcaoCheck: {
        marginLeft: "auto",
    },
})